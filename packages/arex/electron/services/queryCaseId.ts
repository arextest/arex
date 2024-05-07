import { AxiosRequestConfig, AxiosResponse } from 'axios';

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
    replayCaseBatchInfos: {
      caseIds: string[];
      warmUpId?: string;
    }[];
  };
}

export async function queryCaseId(params: QueryCaseIdReq, config?: AxiosRequestConfig) {
  const res = await ScheduleAxios.post<QueryCaseIdReq, AxiosResponse<QueryCaseIdRes>>(
    '/schedule/replay/local/queryCaseId',
    params,
    config,
  );
  return res.data;
}
