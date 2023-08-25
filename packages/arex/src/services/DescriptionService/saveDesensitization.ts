import { request } from '@/utils';

export async function saveDesensitization() {
  const res = await request.get('/report/desensitization/saveJar');
  return res.body;
}
