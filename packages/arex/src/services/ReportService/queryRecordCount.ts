import { request } from '@/utils';

export interface QueryRecordCountReq {
  appId: string;
  beginTime?: number;
  endTime?: number;
}

export interface QueryRecordCountRes {
  recordedCaseCount: number;
}

export async function queryRecordCount(params: QueryRecordCountReq) {
  return request
    .post<QueryRecordCountRes>('/webApi/report/countRecord', params)
    .then((res) => Promise.resolve(res.body.recordedCaseCount));
}
