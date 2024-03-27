import { request } from '@/utils';

import { QueryNodeReq } from './queryIgnoreNode';

export type TransformNode = {
  status: null | number;
  modifiedTime: number;
  id: string;
  appId: string;
  operationId: string;
  expirationType: number;
  expirationDate: number;
  compareConfigType: number;
  fsInterfaceId: string | null;
  dependencyId: string | null;
  operationType: string | null;
  operationName: string | null;
  transformDetail: TransformDetail;
};

export type TransformDetail = {
  nodePath: string[];
  transformMethods: {
    methodName?: string;
    methodArgs?: string;
  }[];
};

export async function queryTransformNode(params: QueryNodeReq<'Global'>) {
  const res = await request.post<TransformNode[]>(
    '/webApi/config/comparison/transform/queryComparisonConfig',
    params,
  );
  return res.body;
}
