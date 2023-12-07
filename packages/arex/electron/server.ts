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
import { zstdDecompress } from './helper';

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

// server.post('/api/zstd', jsonParser, async (req, res) => {
//   try {
//     const data = req.body.data;
//     const decodeString = await zstdDecompress(data);
//
//     res.send({ decode: JSON.parse(decodeString) });
//   } catch (e) {
//     res.send({ error: String(e) });
//   }
// });

// local Schedule createPlan
server.post<QueryCaseIdReq>('/api/createPlan', jsonParser, async (req, res) => {
  logger.log('[request:/api/createPlan] ', req.body);

  try {
    const caseResponse = await queryCaseId(req.body);
    const { result, desc, data } = caseResponse;
    if (result !== 1) {
      res.send({ desc, statusCode: 2, data: { reasonCode: 200 } });
      throw Error(desc);
    }

    const { replayCaseBatchInfos, planId } = caseResponse.data;

    logger.log(`[planId: ${planId}]`, JSON.stringify(caseResponse.data));
    res.send({ desc: 'success', result: 1, data: { reasonCode: 1, replayPlanId: planId } });

    for (const { warmUpId, caseIds } of replayCaseBatchInfos) {
      const caseParametersList = await queryReplaySenderParameters({
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

      logger.log(`[caseIds]:`, caseIds);
      for (const [caseId, caseParameter] of caseParametersMap) {
        await sendCaseFlow(caseParameter, planId, caseId, warmUpId);
      }
    }
  } catch (err) {
    logger.error(err);
  }
});

/**
 * sendCaseFlow: preSend -> send -> postSend
 * @param params
 * @param planId
 * @param caseId
 * @param warmUpId required for warmUp case
 */
async function sendCaseFlow(
  params: ReplaySenderParameters,
  planId: string,
  caseId: string,
  warmUpId?: string,
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
      (await postSend({
        caseId,
        planId,
        sendStatusType: SendStatusType.REPLAY_RESULT_NOT_FOUND,
        errorMsg: 'Replay result not found',
      }));
  } catch (e) {
    const replayId = caseResponse?.headers['arex-replay-id'];
    logger.error(String(e));
    logger.error(
      '[postSend]',
      `[caseId: ${caseId}]`,
      `[replayId: ${replayId}]`,
      `[sendStatusType: 100]`,
    );
    return await postSend({
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
