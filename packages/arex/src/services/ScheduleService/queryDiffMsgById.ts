import { CompareResultDetail } from '@/services/ReportService';
import { request } from '@/utils';

export interface QueryDiffMsgByIdReq {
  id: string;
}

export interface QueryDiffMsgByIdRes {
  compareResultDetail: CompareResultDetail;
  desensitized: boolean;
}

export async function queryDiffMsgById(params: QueryDiffMsgByIdReq) {
  return request
    .get<QueryDiffMsgByIdRes>(`/schedule/report/queryDiffMsgById/${params.id}`)
    .then((res) =>
      Promise.resolve({
        data: res.body.compareResultDetail,
        encrypted: res.body.desensitized,
      }),
    );
}
