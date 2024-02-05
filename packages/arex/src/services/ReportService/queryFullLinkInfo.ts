import { request } from '@/utils';

export type QueryFullLinkInfoReq = {
  recordId: string;
  planItemId: string;
};

export type InfoItem = {
  id: string;
  code: number;
  categoryName: string; // 等效于 operationType，后端字段暂时未修改
  operationType: string; // 接口中暂不存在该字段
  instanceId: string;
  dependencyId: string;
  operationId: string;
  operationName: string;
  isEntry?: boolean;
  ignore?: boolean | null;
};

export type QueryFullLinkInfoRes = {
  entrance: InfoItem | null;
  infoItemList: InfoItem[] | null;
};

export async function queryFullLinkInfo(params: QueryFullLinkInfoReq) {
  return request
    .get<QueryFullLinkInfoRes>(
      `/webApi/report/queryFullLinkInfo/${params.planItemId}/${params.recordId}`,
    )
    .then((res) => res.body);
}
