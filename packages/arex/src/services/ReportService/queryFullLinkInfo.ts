import { request } from '@/utils';

export type QueryFullLinkInfoReq = {
  recordId: string;
  planItemId: string;
};

export type InfoItem = {
  id: string;
  code: number;
  categoryName: string;
  instanceId: string | null;
  foundInSystem: true;
  dependencyId: string | null;
  operationId: string;
  operationName: string;
  isEntry?: boolean;
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
