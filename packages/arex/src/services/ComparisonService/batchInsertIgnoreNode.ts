import { IgnoreNodeBase } from '@/services/ComparisonService/insertIgnoreNode';
import { request } from '@/utils';

export async function batchInsertIgnoreNode(params: IgnoreNodeBase[]) {
  const res = await request.post<boolean>(
    '/report/config/comparison/exclusions/batchModify/INSERT',
    params,
  );
  return res.body;
}
