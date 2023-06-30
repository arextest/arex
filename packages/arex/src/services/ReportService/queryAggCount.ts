import { request } from '@/utils';

export interface QueryAggCountReq {
  appId: string;
  beginTime: number;
  endTime: number;
}

export type AggOperation = {
  status: number;
  modifiedTime: number;
  id: string;
  appId: string;
  serviceId: string;
  operationName: string;
  operationType: string;
  operationTypes: string[];
  operationResponse: string | null;
  recordedCaseCount: number;
};

export interface QueryAggCountRes {
  operationList: AggOperation[];
}

export async function queryAggCount(params: QueryAggCountReq) {
  return request
    .post<QueryAggCountRes>('/report/report/aggCount', params)
    .then((res) => Promise.resolve(res.body.operationList));
}
