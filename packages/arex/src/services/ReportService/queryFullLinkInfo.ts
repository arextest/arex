import { request } from '../../utils';

export type QueryFullLinkInfoReq = {
  recordId: string;
  planItemId: string;
};

export type infoItem = {
  id: string;
  code: number;
  categoryName: string;
  operationName: string;
};

export type QueryFullLinkInfoRes = {
  entrance: infoItem | null;
  infoItemList: infoItem[] | null;
};

export async function queryFullLinkInfo(params: QueryFullLinkInfoReq) {
  return request
    .get<QueryFullLinkInfoRes>(
      `/report/report/queryFullLinkInfo/${params.planItemId}/${params.recordId}`,
    )
    .then((res) => res.body);
}
