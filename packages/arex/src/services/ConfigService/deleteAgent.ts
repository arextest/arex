import { request } from '@/utils';

export async function deleteAgent(params: { id: string; appId: string }) {
  const res = await request.post(`/report/config/applicationInstances/modify/REMOVE`, params, {
    headers: { 'App-Id': params.appId },
  });
  return res.body;
}
