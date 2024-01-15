import { request } from '@/utils';

export interface UpdateIgnoreCategoryReq {
  id: string;
  ignoreCategory: string[];
}

export async function updateIgnoreCategory(params: UpdateIgnoreCategoryReq) {
  const res = await request.post<boolean>(
    '/webApi/config/comparison/ignoreCategory/modify/UPDATE',
    params,
  );
  return res.body;
}
