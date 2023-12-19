import { request } from '@/utils';

export async function deleteExpectation(params: { id: string; appId: string }) {
  const res = await request.post<boolean>('/report/config/expectation/delete', params);
  return res.body;
}
