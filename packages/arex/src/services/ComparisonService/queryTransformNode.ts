import { request } from '@/utils';

import { QueryNodeReq } from './queryIgnoreNode';
import { TransformNode } from '@/services/ComparisonService/transformRootNode/queryTransformRootNode';

export type TransformDetail = {
  nodePath: string[];
  transformMethods: {
    methodName?: string;
    methodArgs?: string;
  }[];
};

export type TransformFlowNode = TransformNode<{ transformDetail: TransformDetail }>;

/**
 * @deprecated flow design is deprecated, use queryTransformRootNode
 * @param params
 */
export async function queryTransformNode(params: QueryNodeReq<'Global'>) {
  const res = await request.post<TransformFlowNode[]>(
    '/webApi/config/comparison/transform/queryComparisonConfig',
    params,
  );
  return res.body;
}
