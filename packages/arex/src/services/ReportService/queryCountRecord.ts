import { request } from '@/utils';

export interface QueryCountRecordRes {
  recordedCaseCount: number;
}

export async function queryCountRecord(appId: string) {
  return request
    .post<QueryCountRecordRes>('/report/report/countRecord/' + appId)
    .then((res) => Promise.resolve(res.body.recordedCaseCount));
}
