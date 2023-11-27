import { request } from '@/utils';

export async function getStorageServiceVersion() {
  const res = await request.get<string>('/version/storage');
  return res.body;
}
