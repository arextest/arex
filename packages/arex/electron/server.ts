import express from 'express';
import logger, { log } from 'electron-log';
import cors from 'cors';
import bodyParser from 'body-parser';
import process from 'process';
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { chunkArray, getLocalConfig } from './helper';
import { SendStatusType } from './services/type';
import type { QueryCaseIdReq, ReplaySenderParameters } from './services';
import {
  queryReplaySenderParameters,
  queryCaseId,
  preSend,
  postSend,
  queryReplayMaxQps,
} from './services';

import port from '../config/port.json';
import proxy from '../config/proxy-electron-sass.json';

const companyName =
  process.env.NODE_ENV === 'development'
    ? process.env.VITE_COMPANY_NAME
    : getLocalConfig('companyName');

// 解析提交的json参数
const jsonParser = bodyParser.json();

const server = express();
server.use(cors());

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

server.listen(port.electronPort, () => {
  logger.log(`Electron server running at http://localhost:${port.electronPort}`);
});

proxy.forEach((item) => {
  server.use(
    item.path,
    createProxyMiddleware({
      target: item.target.replace('{{companyDomainName}}', companyName),
      changeOrigin: true,
      // pathRewrite: { [item.path]: '/api' },
    }),
  );
  server.use(
    '/version' + item.path,
    createProxyMiddleware({
      target: item.target.replace('{{companyDomainName}}', companyName),
      changeOrigin: true,
      // pathRewrite: () => item.target + '/vi/health',
    }),
  );
});

server.get('/api/companyName', (req, res) => {
  res.send({ companyName });
});

// 健康检查
server.get('/vi/health', (req, res) => {
  res.end(`365ms`);
});

server.get('/env', (req, res) => {
  res.send(proxy);
});

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

server.post<QueryCaseIdReq>('/api/createPlan', jsonParser, async (req, res) => {
  logger.log('[request:/api/createPlan] ', req.body);
  const axiosConfig = {
    headers: {
      'access-token': req.headers['access-token'],
    },
  };

  try {
    const caseResponse = await Promise.all([
      queryCaseId(req.body, axiosConfig),
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
});

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
