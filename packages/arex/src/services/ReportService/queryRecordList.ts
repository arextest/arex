import { RecordResult } from '@/services/StorageService';
import { request } from '@/utils';

export interface QueryRecordListReq {
  appId: string;
  operationName: string;
  operationType: string;
  pageSize: number;
  lastId: string;
}

export interface QueryRecordListRes {
  totalCount: number;
  recordList: RecordResult[];
}

export async function queryRecordList(params: QueryRecordListReq) {
  return request
    .post<QueryRecordListRes>('/report/report/listRecord', params)
    .then((res) => Promise.resolve(res.body.recordList));
}
