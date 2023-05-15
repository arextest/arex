import { request } from '@/utils';

export type SaveLabelsReq = {
  id: string;
  workspaceId: string;
  labelName: string;
  color: string;
};

export async function saveLabels(params: SaveLabelsReq) {
  const res = await request.post<{ success: boolean }>(`/report/label/save`, params);
  return res.body.success ? Promise.resolve(res.body) : Promise.reject({ success: false });
}
