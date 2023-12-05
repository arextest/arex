import { AxiosResponse } from 'axios';

import { ScheduleAxios } from './index';

export interface QueryCaseIdReq {
  appId: string;
  sourceEnv: string;
  targetEnv: string;
  caseSourceFrom: number;
  caseSourceTo: number;
  operator: string;
  replayPlanType: number; // TODO enum
}

export interface QueryCaseIdRes {
  result: number;
  desc: string;
  data: {
    planId: string;
    batchCaseIdsMap: Record<string, string[]>;
    batchWarmUpCaseIdMap: Record<string, string>;
  };
}

export default async function queryCaseId(params: QueryCaseIdReq) {
  const res = await ScheduleAxios.post<QueryCaseIdReq, AxiosResponse<QueryCaseIdRes>>(
    '/api/replay/local/queryCaseId',
    params,
  );
  return res.data;
}
