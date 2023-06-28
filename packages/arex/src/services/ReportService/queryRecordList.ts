import { RecordResult } from '@/services/StorageService';
import { request } from '@/utils';

export interface QueryRecordListReq {
  appId: string;
  beginTime: number;
  endTime: number;
  operationType: string;
  pageSize: number;
  pageIndex: number;
  operationName: string;
}

export interface QueryRecordListRes {
  totalCount: number;
  recordList: RecordResult[];
}

export async function queryRecordList(params: QueryRecordListReq) {
  return request.post<QueryRecordListRes>('/report/report/listRecord', params).then((res) =>
    Promise.resolve({
      total: res.body.totalCount,
      list: res.body.recordList,
    }),
  );
}
