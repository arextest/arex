import { request } from '@/utils';

export async function deleteIgnoreNode(params: { id: string }) {
  const res = await request.post<boolean>(
    '/report/config/comparison/exclusions/modify/REMOVE',
    params,
  );
  return res.body;
}
