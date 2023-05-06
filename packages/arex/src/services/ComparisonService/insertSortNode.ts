import { SortNodeBase } from '@/services/ComparisonService/querySortNode';
import { request } from '@/utils';

export async function insertSortNode(params: SortNodeBase) {
  const res = await request.post<boolean>(
    '/report/config/comparison/listsort/modify/INSERT',
    params,
  );
  return res.body;
}
