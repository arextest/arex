import { SortNodePathKey } from '@/services/ComparisonService/querySortNode';
import { request } from '@/utils';

export interface UpdateSortNodeReq extends SortNodePathKey {
  id: string;
}

export async function updateSortNode(params: UpdateSortNodeReq) {
  const res = await request.post<boolean>(
    '/report/config/comparison/listsort/modify/UPDATE',
    params,
  );
  return res.body;
}
