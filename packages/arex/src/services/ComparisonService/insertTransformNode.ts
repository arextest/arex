import { request } from '@/utils';

import { QueryNodeReq } from './queryIgnoreNode';
import { TransformDetail } from './queryTransformNode';

export interface InsertTransformNodeReq extends QueryNodeReq<'Global'> {
  transformDetail: TransformDetail;
}

export async function insertTransformNode(params: InsertTransformNodeReq) {
  const res = await request.post<boolean>(
    '/webApi/config/comparison/transform/modify/INSERT',
    params,
  );
  return res.body;
}
