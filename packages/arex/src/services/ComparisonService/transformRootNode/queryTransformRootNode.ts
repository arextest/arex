import { QueryNodeReq } from '@/services/ComparisonService';
import { request } from '@/utils';

export type TransformNode<T> = {
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
} & T;

export type TransformRootNodeParams = { transformMethodName: string };
export type TransformRootNode = TransformNode<TransformRootNodeParams>;

export async function queryTransformRootNode(params: QueryNodeReq<'Global'>) {
  const res = await request.post<TransformRootNode[]>(
    '/webApi/config/comparison/rootTransform/queryComparisonConfig',
    params,
  );
  return res.body;
}
