import { BaseInterface } from '@/services/FileSystemService';
import { request } from '@/utils';

export type SaveCaseReq =
  | (Partial<BaseInterface> & { workspaceId: string })
  | { id: string; labelIds: string[]; workspaceId: string };

export async function saveCase(params: SaveCaseReq) {
  const res = await request.post<{ success: boolean }>(`/report/filesystem/saveCase`, params);
  return res.body.success;
}
