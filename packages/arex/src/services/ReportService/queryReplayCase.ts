import { request } from '@/utils';

export interface QueryReplayCaseReq {
  needTotal?: boolean;
  pageIndex?: number;
  pageSize?: number;
  planItemId: string;
  diffResultCode?: number;
}

export type ReplayCaseType = {
  replayId: string;
  recordId: string;
  caseId: string;
  diffResultCode: number;
};

export interface QueryReplayCaseRes {
  result: ReplayCaseType[];
  totalCount: number;
}

export async function queryReplayCase(params: QueryReplayCaseReq) {
  return request.post<QueryReplayCaseRes>('/report/report/queryReplayCase', params).then((res) =>
    Promise.resolve({
      total: res.body.totalCount,
      list: res.body.result,
    }),
  );
}
