import { AxiosResponse } from 'axios/index';

import { ScheduleAxios } from './index';

export interface QueryReplaySenderParametersReq {
  caseIds: string[];
  planId: string;
  replayPlanType: number; // TODO enum
}

export type ReplaySenderParameters = {
  appId: string;
  url: string;
  operation: string;
  message: string; // post request data
  subEnv: string;
  headers: Record<string, string>;
  recordId: string;
  method: string;
};

export interface QueryReplaySenderParametersRes {
  result: number;
  desc: string;
  data: {
    replaySenderParametersMap: Record<string, ReplaySenderParameters>;
  };
}

export default async function queryReplaySenderParameters(params: QueryReplaySenderParametersReq) {
  const res = await ScheduleAxios.post<
    QueryReplaySenderParametersReq,
    AxiosResponse<QueryReplaySenderParametersRes>
  >('/api/replay/local/queryReplaySenderParameters', params);
  return res.data;
}
