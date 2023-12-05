import express from 'express';
import logger from 'electron-log';
import cors from 'cors';
import bodyParser from 'body-parser';

import { createProxyMiddleware } from 'http-proxy-middleware';

import port from '../config/port.json';
import proxy from '../config/proxy.json';
import queryCaseId, { QueryCaseIdReq } from './services/schedule/queryCaseId';
import queryReplaySenderParameters, {
  ReplaySenderParameters,
} from './services/schedule/queryReplaySenderParameters';
import preSend from './services/schedule/preSend';
import axios, { AxiosResponse } from 'axios';
import postSend from './services/schedule/postSend';
import { SendStatusType } from './services/schedule/type';

// 解析提交的json参数
let jsonParser = bodyParser.json();

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
      target: item.target,
      changeOrigin: true,
      pathRewrite: { [item.path]: '/api' },
    }),
  );
  server.use(
    '/version' + item.path,
    createProxyMiddleware({
      target: item.target,
      changeOrigin: true,
      pathRewrite: () => item.target + '/vi/health',
    }),
  );
});

// 健康检查
server.get('/vi/health', (req, res) => {
  res.end(`365ms`);
});

server.get('/env', (req, res) => {
  res.send(proxy);
});

// local Schedule createPlan
server.post<QueryCaseIdReq>('/api/createPlan', jsonParser, async (req, res) => {
  logger.log('[request:/api/createPlan] ', req.body);

  const startTime = Date.now();
  try {
    const caseResponse = await queryCaseId(req.body);
    const { result, desc, data } = caseResponse;
    if (result !== 1) throw Error(desc);

    const {
      batchCaseIdsMap: batchCaseIdsList,
      batchWarmUpCaseIdMap: batchWarmUpCaseIdList,
      planId,
    } = caseResponse.data;

    logger.log(`[planId: ${planId}]`);
    res.send({ desc: 'success', result: 1, data: { reasonCode: 1, replayPlanId: planId } });

    const batchCaseIdsMap = new Map(Object.entries(batchCaseIdsList));
    const batchWarmUpCaseIdMap = new Map(Object.entries(batchWarmUpCaseIdList));
    for (const [batchId, caseIds] of batchCaseIdsMap) {
      const {
        data: { replaySenderParametersMap: caseParametersList },
      } = await queryReplaySenderParameters({
        planId,
        replayPlanType: 0,
        caseIds,
      });

      const caseParametersMap = new Map(Object.entries(caseParametersList));

      // case query Parameters failed (in caseIds but not in key of caseParametersMap)
      const caseParametersKeys = Object.keys(caseParametersList);
      const invalidCaseIds = caseIds.filter((id) => !caseParametersKeys.includes(id));
      if (invalidCaseIds.length) {
        logger.error('Has invalid CaseIds', invalidCaseIds);
        for (const caseId of invalidCaseIds) {
          await postSend({
            caseId,
            planId,
            sendStatusType: SendStatusType.REPLAY_CASE_NOT_FOUND,
            errorMsg: 'Replay case not found',
          });
        }
      } else {
        logger.log('All CaseIds valid');
      }

      const warmUpCaseId = batchWarmUpCaseIdMap.get(batchId);
      const warmUpCaseParameter = caseParametersMap.get(warmUpCaseId);
      caseParametersMap.delete(warmUpCaseId);

      // warmUpCase -> commonCase
      await sendCaseFlow(warmUpCaseParameter, planId, warmUpCaseId, batchId);
      for (const [caseId, caseParameter] of caseParametersMap) {
        await sendCaseFlow(caseParameter, planId, caseId);
      }
    }
  } catch (err) {
    res.send({ desc: String(err), statusCode: 2, data: { reasonCode: 200 } });
  }
});

/**
 * sendCaseFlow: preSend -> send -> postSend
 * @param params
 * @param planId
 * @param caseId
 * @param batchId required for warmUp case
 */
async function sendCaseFlow(
  params: ReplaySenderParameters,
  planId: string,
  caseId: string,
  batchId?: string,
) {
  // preSend
  try {
    await preSend({
      planId,
      caseId,
      recordId: params.recordId,
      replayPlanType: 1,
    });
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

    caseResponse = await axios.request({
      baseURL: params.url,
      url: params.operation,
      headers: { ...params.headers, arex_replay_prepare_dependency: batchId },
      method: params.method,
      ...data,
    });
    const replayId = caseResponse?.headers['arex-replay-id'];

    // no replayId
    !replayId &&
      (await postSend({
        caseId,
        planId,
        sendStatusType: SendStatusType.REPLAY_RESULT_NOT_FOUND,
        errorMsg: 'Replay result not found',
      }));
  } catch (e) {
    const replayId = caseResponse?.headers['arex-replay-id'];
    logger.error(
      '[postSend]',
      `[caseId: ${caseId}]`,
      `[replayId: ${replayId}]`,
      `[sendStatusType: 100]`,
    );
    await postSend({
      caseId,
      planId,
      replayId,
      sendStatusType: SendStatusType.EXCEPTION_FAILED,
      errorMsg: String(e),
    });
  }

  // postSend: success status
  const replayId = caseResponse?.headers['arex-replay-id'];
  logger.log('[postSend]', `[caseId: ${caseId}]`, `[replayId: ${replayId}]`, `[sendStatusType: 1]`);
  await postSend({
    caseId,
    planId,
    replayId,
    sendStatusType: SendStatusType.SUCCESS,
    errorMsg: '',
  });
}
