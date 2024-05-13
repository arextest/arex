import { request } from '@/utils';

export async function deleteIgnoreCategory(params: { id: string }) {
  const res = await request.post<boolean>(
    '/webApi/config/comparison/ignoreCategory/modify/REMOVE',
    params,
  );
  return res.body;
}
