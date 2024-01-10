import { request } from '@/utils';

export type Label = {
  id: string;
  labelName: string;
  color: string;
  workspaceId: string;
};

export interface QueryLabelsRes {
  labels: Label[];
}

export async function queryLabels(params: { workspaceId: string }) {
  const res = await request.post<QueryLabelsRes>(`/webApi/label/queryLabelsByWorkspaceId`, params);
  return res.body.labels;
}
