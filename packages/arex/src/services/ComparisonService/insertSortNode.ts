import { SortNodeBase } from '@/services/ComparisonService/querySortNode';
import { request } from '@/utils';

export async function insertSortNode(params: SortNodeBase) {
  const res = await request.post<boolean>(
    '/webApi/config/comparison/listsort/modify/INSERT',
    params,
  );
  return res.body;
}
