import { request } from '@/utils';

export async function deleteApplication(params: { appId: string }) {
  const res = await request.post<boolean>('/storage/config/app/delete', params);
  return res.body;
}
