import { QueryIgnoreNode, QueryNodeReq } from '@/services/ComparisonService/queryIgnoreNode';
import { request } from '@/utils';

export interface QueryEncryptionNode extends Omit<QueryIgnoreNode, 'path'> {
  path: string[];
  methodName: string;
}

export async function queryEncryptionNode(params: QueryNodeReq<'Global'>) {
  const res = await request.post<QueryEncryptionNode[]>(
    '/report/config/comparison/encryption/queryComparisonConfig',
    params,
  );
  return res.body;
}
