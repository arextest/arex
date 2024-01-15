import { request } from '@/utils';

export async function deleteIgnoreNode(params: { id: string }) {
  const res = await request.post<boolean>(
    '/webApi/config/comparison/exclusions/modify/REMOVE',
    params,
  );
  return res.body;
}
