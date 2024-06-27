import { request } from '@/utils';

import { TransformDetail } from './queryTransformNode';

export interface UpdateTransformNodeReq {
  id: string;
  transformDetail: TransformDetail;
}

/**
 * @deprecated flow design is deprecated, use queryComparisonConfig
 * @param params
 */
export async function updateTransformNode(params: UpdateTransformNodeReq) {
  const res = await request.post<boolean>(
    '/webApi/config/comparison/transform/modify/UPDATE',
    params,
  );
  return res.body;
}
