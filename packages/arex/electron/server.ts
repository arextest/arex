import express, { Router } from 'express';
import logger, { log } from 'electron-log';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Request } from 'express';

import { chunkArray, getLocalConfig, setLocalConfig } from './helper';
import { SendStatusType } from './services/type';
import {
  QueryCaseIdReq,
  queryReRunCaseId,
  QueryRerunCaseIdReq,
  ReplaySenderParameters,
} from './services';
import {
  queryReplaySenderParameters,
  queryCaseId,
  preSend,
  postSend,
  queryReplayMaxQps,
} from './services';

import port from '../config/port.json';
import proxy from '../config/proxy-electron-sass.json';
import { formatRequestLog } from './logger';

// 解析提交的json参数
const jsonParser = bodyParser.json();

// router is designed to be redefined, for different organization
// https://github.com/expressjs/express/issues/2596
let router: Router = undefined;

const server = express();
server.use(cors());
server.use((req, res, next) => {
  router?.(req, res, next);
});

const initialOrganization = getLocalConfig('organization') || 'arex';
defineRouter(initialOrganization);

server.get('/api/organization', (req, res) => {
  res.send({ organization: getLocalConfig('organization') });
});

server.post<{ organization: string }>('/api/organization', jsonParser, async (req, res) => {
  const organization = req.body.organization;
  defineRouter(organization);
  setLocalConfig('organization', organization);
  res.send({ organization });
});

server.delete('/api/organization', (req, res) => {
  logger.log('Delete organization');
  setLocalConfig('organization', '');
  res.send(true);
});

server.listen(port.electronPort, () => {
  logger.log(`Electron server running at http://localhost:${port.electronPort}`);
});

function defineRouter(organization: string) {
  router = express.Router();

  proxy.forEach((item) => {
    router.use(
      item.path,
      createProxyMiddleware({
        target: item.target.replace('{{companyDomainName}}', organization),
        changeOrigin: true,
      }),
    );
    router.use(
      '/version' + item.path,
      createProxyMiddleware({
        target: item.target.replace('{{companyDomainName}}', organization),
        changeOrigin: true,
      }),
    );
  });

  async function handleCreateOrRerunPlan(
    rerun = false,
    req: Request<QueryCaseIdReq> | Request<QueryRerunCaseIdReq>,
    res,
  ) {
    const axiosConfig = {
      headers: {
        'access-token': req.headers['access-token'],
      },
    };
    try {
      const caseResponse = await Promise.all([
        rerun ? queryReRunCaseId(req.body, axiosConfig) : queryCaseId(req.body, axiosConfig),
        queryReplayMaxQps({ appId: req.body.appId }, axiosConfig),
      ]);
      const [{ result, desc, data }, maxQps = 20] = caseResponse;
      if (result !== 1) {
        throw Error(desc);
      }

      const { replayCaseBatchInfos, planId } = data;

      logger.log(`[planId: ${planId}]`, JSON.stringify(data));
      res.send({ desc: 'success', result: 1, data: { reasonCode: 1, replayPlanId: planId } });

      for (const { warmUpId, caseIds } of replayCaseBatchInfos) {
        const chunkCaseIds = chunkArray(caseIds, 100);
        const chunkPromises = chunkCaseIds.map((caseIds) =>
          queryReplaySenderParameters({ planId, replayPlanType: 0, caseIds }, axiosConfig),
        );
        const chunkCaseParametersList = await Promise.all(chunkPromises);

        const caseParametersList = chunkCaseParametersList.reduce((acc, cur) => {
          return { ...acc, ...cur };
        }, {});

        const caseParametersMap = new Map(Object.entries(caseParametersList));

        // case query Parameters failed (in caseIds but not in key of caseParametersMap)
        const caseParametersKeys = Object.keys(caseParametersList);
        const invalidCaseIds = caseIds.filter((id) => !caseParametersKeys.includes(id));
        if (invalidCaseIds.length) {
          logger.error('Has invalid CaseIds', invalidCaseIds);
          for (const caseId of invalidCaseIds) {
            await postSend(
              {
                caseId,
                planId,
                sendStatusType: SendStatusType.REPLAY_CASE_NOT_FOUND,
                errorMsg: 'Replay case not found',
              },
              axiosConfig,
            );
          }
        } else {
          logger.log('All CaseIds valid');
        }

        logger.log(`[caseIds]:`, caseIds);
        // for (const [caseId, caseParameter] of caseParametersMap) {
        //   await sendCaseFlow(caseParameter, planId, caseId, warmUpId);
        // }

        parallelSendCases(caseParametersMap, planId, warmUpId, maxQps, axiosConfig);
      }
    } catch (err) {
      logger.error(err);
      res.send({ desc: err, statusCode: 2, data: { reasonCode: 200 } });
    }
  }

  router.post<QueryCaseIdReq>('/api/createPlan', jsonParser, async (req, res) => {
    logger.log('[request:/api/createPlan] ', formatRequestLog(req));
    await handleCreateOrRerunPlan(false, req, res);
  });

  router.post<QueryRerunCaseIdReq>('/api/rerunPlan', jsonParser, async (req, res) => {
    logger.log('[request:/api/rerunPlan] ', formatRequestLog(req));
    await handleCreateOrRerunPlan(true, req, res);
  });
}

// 健康检查
router?.get('/vi/health', (req, res) => {
  res.end(`365ms`);
});

router?.get('/env', (req, res) => {
  res.send(proxy);
});

export function oauth(callback: (path: string, code: string) => void) {
  server.get('/oauth/*', async (req, res) => {
    try {
      logger.log(`login from ${req.path}`);
      callback(req.path, req.query.code as string);
      res.send('Login successful! You can close this window now.');
    } catch (error) {
      logger.error('Error occurred during login.');
      res.status(500).send('Error occurred during login.');
    }
  });
}

/**
 * sendCaseFlow: preSend -> send -> postSend
 * @param params
 * @param planId
 * @param caseId
 * @param warmUpId required for warmUp case
 * @param axiosConfig
 */
async function sendCaseFlow(
  params: ReplaySenderParameters,
  planId: string,
  caseId: string,
  warmUpId?: string,
  axiosConfig?: AxiosRequestConfig,
) {
  // preSend
  try {
    await preSend(
      {
        planId,
        caseId,
        recordId: params.recordId,
        replayPlanType: 1,
      },
      axiosConfig,
    );
  } catch (e) {
    const error =
      String(e) + `params: [planId: ${planId}] [caseId: ${caseId}] [recordId: ${params.recordId}]`;
    logger.error(error);
    throw Error(error);
  }

  logger.log('[preSend]', `[recordId: ${params.recordId}]`, `[replayPlanType: 1]`);

  // send
  let caseResponse: AxiosResponse;
  try {
    const data =
      params.method.toLowerCase() === 'post'
        ? {
            data: params.message,
          }
        : {};

    // logger.log(`[send]`, params);
    caseResponse = await axios.request({
      baseURL: params.url,
      url: params.operation,
      headers: { ...params.headers, arex_replay_prepare_dependency: warmUpId },
      method: params.method,
      ...data,
    });
    const replayId = caseResponse?.headers['arex-replay-id'];

    // no replayId
    !replayId &&
      (await postSend(
        {
          caseId,
          planId,
          sendStatusType: SendStatusType.REPLAY_RESULT_NOT_FOUND,
          errorMsg: 'Replay result not found',
        },
        axiosConfig,
      ));
  } catch (e) {
    const replayId = caseResponse?.headers['arex-replay-id'];
    logger.error(String(e));
    logger.error(
      '[postSend]',
      `[caseId: ${caseId}]`,
      `[replayId: ${replayId}]`,
      `[sendStatusType: 100]`,
    );
    return await postSend(
      {
        caseId,
        planId,
        replayId,
        sendStatusType: SendStatusType.EXCEPTION_FAILED,
        errorMsg: String(e),
      },
      axiosConfig,
    );
  }

  // postSend: success status
  const replayId = caseResponse?.headers['arex-replay-id'];
  logger.log('[postSend]', `[caseId: ${caseId}]`, `[replayId: ${replayId}]`, `[sendStatusType: 1]`);
  await postSend(
    {
      caseId,
      planId,
      replayId,
      sendStatusType: SendStatusType.SUCCESS,
      errorMsg: '',
    },
    axiosConfig,
  );
}

// local Schedule createPlan
const parallelSendCases = async (
  caseParametersMap: Map<string, ReplaySenderParameters>,
  planId: string,
  warmUpId: string,
  maxQps: number,
  axiosConfig?: AxiosRequestConfig,
) => {
  const caseEntries = Array.from(caseParametersMap.entries());
  const totalCases = caseEntries.length;
  let currentIndex = 0;

  async function processBatch() {
    const batch = caseEntries.slice(currentIndex, currentIndex + maxQps);
    currentIndex += maxQps;

    const batchPromises = batch.map(([caseId, caseParameter]) =>
      sendCaseFlow(caseParameter, planId, caseId, warmUpId, axiosConfig),
    );

    await Promise.all(batchPromises);

    if (currentIndex < totalCases) {
      await processBatch(); // Continue processing the next batch
    }
  }

  await processBatch();
  logger.log('All cases sent successfully.');
};
