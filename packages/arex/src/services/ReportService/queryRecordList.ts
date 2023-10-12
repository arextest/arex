import { RecordResult } from '@/services/StorageService';
import { request } from '@/utils';

export interface QueryRecordListReq {
  appId: string;
  operationType: string;
  pageSize: number;
  pageIndex: number;
  operationName: string;
  beginTime?: number;
  endTime?: number;
}

export interface QueryRecordListRes {
  totalCount: number;
  recordList: RecordResult[];
}

export async function queryRecordList(params: QueryRecordListReq) {
  return request
    .post<QueryRecordListRes>('/report/report/listRecord', params, {
      headers: { 'App-Id': params.appId },
    })
    .then((res) =>
      Promise.resolve({
        total: res.body.totalCount,
        list: res.body.recordList,
      }),
    );
}
