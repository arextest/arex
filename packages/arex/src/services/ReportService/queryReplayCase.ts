import { request } from '../../utils';

export interface QueryReplayCaseReq {
  needTotal?: boolean;
  pageIndex?: number;
  pageSize?: number;
  planItemId: string;
}

export type ReplayCaseType = {
  replayId: string;
  recordId: string;
  diffResultCode: number;
};

export interface QueryReplayCaseRes {
  result: ReplayCaseType[];
  totalCount: number;
}

export async function queryReplayCase({
  planItemId,
  needTotal = false,
  pageIndex = 1,
  pageSize = 99,
}: QueryReplayCaseReq) {
  return request
    .post<QueryReplayCaseRes>('/report/report/queryReplayCase', {
      needTotal,
      pageIndex,
      pageSize,
      planItemId,
    })
    .then((res) => Promise.resolve(res.body.result));
}
