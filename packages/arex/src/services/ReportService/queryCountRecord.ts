import { request } from '@/utils';

export interface QueryCountRecordReq {
  appId: string;
  beginTime?: number;
  endTime?: number;
}

export interface QueryCountRecordRes {
  recordedCaseCount: number;
}

export async function queryCountRecord(params: QueryCountRecordReq) {
  return request
    .post<QueryCountRecordRes>('/report/report/countRecord', params)
    .then((res) => Promise.resolve(res.body.recordedCaseCount));
}
