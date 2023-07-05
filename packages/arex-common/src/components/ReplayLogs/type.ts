import { BizLogLevel, BizLogType } from './constant';

export type BizLogLevelValue = (typeof BizLogLevel)[keyof typeof BizLogLevel];
export type BizLogTypeValue = (typeof BizLogType)[keyof typeof BizLogType];

export type QueryPlanLogsReq = {
  planId: string;
  condition: {
    levels?: BizLogLevelValue[];
    types?: BizLogTypeValue[];
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
  level: BizLogLevelValue;
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
