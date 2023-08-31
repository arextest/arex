import { QueryNodeReq } from '@/services/ComparisonService/queryIgnoreNode';
import { request } from '@/utils';

export interface UpdateIgnoreCategoryReq extends QueryNodeReq<'Interface'> {
  ignoreCategory: string[];
}

export async function updateIgnoreCategory(params: UpdateIgnoreCategoryReq) {
  const res = await request.post<boolean>(
    '/report/config/comparison/ignoreCategory/modify/INSERT',
    params,
  );
  return res.body;
}
