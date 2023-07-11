import { request } from '@/utils';

export type QueryFullLinkInfoReq = {
  recordId: string;
  planItemId: string;
};

export type InfoItem = {
  id: string;
  code: number;
  categoryName: string;
  operationName: string;
  instanceId: string | null;
  foundInSystem: true;
  operationId: string;
  dependencyId: string | null;
};

export type QueryFullLinkInfoRes = {
  entrance: InfoItem | null;
  infoItemList: InfoItem[] | null;
};

export async function queryFullLinkInfo(params: QueryFullLinkInfoReq) {
  return request
    .get<QueryFullLinkInfoRes>(
      `/report/report/queryFullLinkInfo/${params.planItemId}/${params.recordId}`,
    )
    .then((res) => res.body);
}
