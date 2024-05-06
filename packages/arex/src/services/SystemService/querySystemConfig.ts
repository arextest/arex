import { request } from '@/utils';

export async function querySystemConfig(key: string) {
  const res = await request.get<Record<string, any> | null>(`/webApi/system/config/query/${key}`);
  return res.body;
}
