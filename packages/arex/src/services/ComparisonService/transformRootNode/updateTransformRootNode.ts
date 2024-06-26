import { request } from '@/utils';
import { QueryNodeReq } from '@/services/ComparisonService';
import { TransformRootNodeParams } from './queryTransformRootNode';

interface UpdateTransformRootNodeReq extends QueryNodeReq<'Global'>, TransformRootNodeParams {}

export async function updateTransformRootNode(params: UpdateTransformRootNodeReq) {
  const res = await request.post<boolean>(
    '/webApi/config/comparison/rootTransform/modify/INSERT',
    params,
  );

  return res.body;
}
