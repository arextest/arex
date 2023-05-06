import { request } from '@/utils';

export async function deleteSortNode(params: { id: string }) {
  const res = await request.post<boolean>(
    '/report/config/comparison/listsort/modify/REMOVE',
    params,
  );
  return res.body;
}
