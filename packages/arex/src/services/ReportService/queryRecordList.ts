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

export type RecordType = {
  createTime: number;
  operationType: string;
  recordId: string;
};
export interface QueryRecordListRes {
  totalCount: number;
  recordList: RecordType[];
}

export async function queryRecordList(params: QueryRecordListReq) {
  return request.post<QueryRecordListRes>('/webApi/report/listRecord', params).then((res) =>
    Promise.resolve({
      total: res.body.totalCount,
      list: res.body.recordList,
    }),
  );
}
