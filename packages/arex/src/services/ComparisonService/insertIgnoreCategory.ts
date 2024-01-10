import { QueryNodeReq } from '@/services/ComparisonService/queryIgnoreNode';
import { request } from '@/utils';

export interface InsertIgnoreCategoryReq extends QueryNodeReq<'Interface'> {
  ignoreCategory: string[];
}

export async function insertIgnoreCategory(params: InsertIgnoreCategoryReq) {
  const res = await request.post<boolean>(
    '/webApi/config/comparison/ignoreCategory/modify/INSERT',
    params,
  );
  return res.body;
}
