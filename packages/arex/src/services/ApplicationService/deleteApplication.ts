import { request } from '@/utils';

export async function deleteApplication(params: { appId: string }) {
  const res = await request.post<boolean>('/report/config/application/modify/REMOVE', params, {
    headers: { 'App-Id': params.appId },
  });
  return res.body;
}
