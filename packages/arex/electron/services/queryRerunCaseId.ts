import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { QueryCaseIdRes, ScheduleAxios } from './index';

export interface QueryRerunCaseIdReq {
  planId: string;
  planItemId?: string;
}

export async function queryReRunCaseId(params: QueryRerunCaseIdReq, config?: AxiosRequestConfig) {
  const res = await ScheduleAxios.post<QueryRerunCaseIdReq, AxiosResponse<QueryCaseIdRes>>(
    '/schedule/replay/local/queryReRunCaseId',
    params,
    config,
  );
  return res.data;
}
