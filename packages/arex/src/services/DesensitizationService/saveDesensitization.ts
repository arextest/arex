import { request } from '@/utils';

export async function saveDesensitization(params: { jarUrl: string; remark?: string }) {
  const res = await request.post<boolean>('/report/desensitization/saveJar', params);
  return res.body;
}
