import { request } from '@/utils';

export async function batchDeleteIgnoreNode(params: { id: string }[]) {
  const res = await request.post<boolean>(
    '/webApi/config/comparison/exclusions/batchModify/REMOVE',
    params,
  );
  return res.body;
}
