import { request } from '@/utils';

export async function deleteDesensitization() {
  const res = await request.get('/report/desensitization/deleteJar');
  return res.body;
}
