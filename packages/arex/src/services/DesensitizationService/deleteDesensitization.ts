import { request } from '@/utils';

export async function deleteDesensitization(params: { id: string }) {
  const res = await request.post<boolean>('/webApi/desensitization/deleteJar', params);
  return res.body;
}
