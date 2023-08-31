import { IgnoreNodeBase } from '@/services/ComparisonService/queryIgnoreNode';
import { request } from '@/utils';

export async function insertEncryptionNode(params: IgnoreNodeBase) {
  const res = await request.post<boolean>(
    '/report/config/comparison/encryption/modify/INSERT',
    params,
  );
  return res.body;
}
