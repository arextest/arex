import { request } from '@/utils';

export async function querySystemConfig(key: string) {
  const res = await request.get<Record<string, any>>(`/webApi/system/config/query/${key}`);
  return res.body;
}
