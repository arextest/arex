import { request } from '@/utils';

export async function removeLabels(params: { workspaceId: string; id: string }) {
  const res = await request.post<{ success: boolean }>(`/webApi/label/remove`, params);
  return res.body.success ? Promise.resolve(res.body) : Promise.reject({ success: false });
}
