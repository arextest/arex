import { request } from '@/utils';

import { IgnoreCategory } from './insertIgnoreCategory';

export interface UpdateIgnoreCategoryReq {
  id: string;
  ignoreCategories: IgnoreCategory[];
}

export async function updateIgnoreCategory(params: UpdateIgnoreCategoryReq) {
  const res = await request.post<boolean>(
    '/webApi/config/comparison/ignoreCategory/modify/UPDATE',
    params,
  );
  return res.body;
}
