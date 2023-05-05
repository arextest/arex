import { request } from '../../utils';
import { CompareResultDetail } from './queryAllDiffMsg';

export interface QueryDiffMsgByIdReq {
  id: string;
}

export interface QueryDiffMsgByIdRes {
  compareResultDetail: CompareResultDetail;
}

export async function queryDiffMsgById(params: QueryDiffMsgByIdReq) {
  return request
    .get<QueryDiffMsgByIdRes>(`/report/report/queryDiffMsgById/${params.id}`)
    .then((res) => Promise.resolve(res.body.compareResultDetail));
}
