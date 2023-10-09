import { request } from '@/utils';

export async function getUsersByKeyword(keyword: string) {
  if (!keyword) return Promise.resolve([]);
  const res = await request.get<{ userName: string }[]>('/report/login/listUsers/' + keyword);
  return res.body;
}
