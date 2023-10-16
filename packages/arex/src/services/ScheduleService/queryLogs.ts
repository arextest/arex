import { getLocalStorage } from '@arextest/arex-core';
import axios from 'axios';

import { ACCESS_TOKEN_KEY, APP_ID_KEY } from '@/constant';
export enum BizLogLevel {
  INFO,
  WARN,
  ERROR,
  DEBUG,
}

export enum BizLogType {
  PLAN_START = 0,
  PLAN_CASE_SAVED = 1,
  PLAN_CONTEXT_BUILT = 2,
  PLAN_DONE = 3,
  PLAN_ASYNC_RUN_START = 4,
  PLAN_STATUS_CHANGE = 5,
  PLAN_FATAL_ERROR = 6,

  QPS_LIMITER_INIT = 100,
  QPS_LIMITER_CHANGE = 101,

  CONTEXT_START = 200,
  CONTEXT_AFTER_RUN = 202,
  CONTEXT_SKIP = 203,
  CONTEXT_NORMAL = 204,

  ACTION_ITEM_CASE_SAVED = 306,
  ACTION_ITEM_EXECUTE_CONTEXT = 300,
  ACTION_ITEM_INIT_TOTAL_COUNT = 302,
  ACTION_ITEM_STATUS_CHANGED = 303,
  ACTION_ITEM_SENT = 304,
  ACTION_ITEM_BATCH_SENT = 305,

  RESUME_START = 400,
}

export type QueryPlanLogsReq = {
  planId: string;
  condition: {
    levels?: BizLogLevel[];
    types?: BizLogType[];

    pageNum: number;
    pageSize: number;
  };
};

export type QueryPlanLogsRes = {
  logs: BizLog[];
  planId: string;
  total: number;
};

export type BizLog = {
  date: string;
  level: BizLogLevel;
  message: string;
  logType: number;

  planId: string;
  resumedExecution: boolean;
  contextName: string;

  contextIdentifier: string;
  caseItemId: string;
  actionItemId: string;
  operationName: string;

  exception: string;
  request: string;
  response: string;
  traceId: string;
  extra: string;
};

export async function queryLogs(req: QueryPlanLogsReq) {
  return new Promise<QueryPlanLogsRes>((resolve, reject) => {
    return axios
      .post('/schedule/queryPlanLogs', req, {
        headers: {
          'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
          appId: getLocalStorage<string>(APP_ID_KEY),
        },
      })
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}
