import { IgnoreNodeBase } from '@/services/ComparisonService/queryIgnoreNode';
import { request } from '@/utils';

export async function batchInsertIgnoreNode(params: IgnoreNodeBase[]) {
  const res = await request.post<boolean>(
    '/report/config/comparison/exclusions/batchModify/INSERT',
    params,
  );
  return res.body;
}
