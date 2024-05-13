import { request } from '@/utils';

export async function deleteAgent(params: { id: string; appId: string }) {
  const res = await request.post(`/webApi/config/applicationInstances/modify/REMOVE`, params);
  return res.body;
}
