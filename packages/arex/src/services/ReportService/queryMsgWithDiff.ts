import { request } from '@/utils';

import { LogEntity } from './queryLogEntity';

export type QueryMsgWithDiffReq = { logIndexes: string; compareResultId: string };
export type QueryMsgWithDiffRes = {
  baseMsg: string | boolean | null;
  testMsg: string | boolean | null;
  diffResultCode: number;
  logs: LogEntity[] | null;
  recordId: string;
  replayId: string;
};

export async function queryMsgWithDiff(params: QueryMsgWithDiffReq) {
  return request
    .post<QueryMsgWithDiffRes>('/report/report/queryMsgWithDiff', params)
    .then((res) => Promise.resolve(res.body));
}
