import { BaseInterface } from '@/services/FileSystemService/queryInterface';
import { request } from '@/utils';

export interface SaveInterfaceReq extends Partial<BaseInterface> {
  workspaceId: string;
}

export async function saveInterface(params: SaveInterfaceReq) {
  const res = await request.post<{ success: boolean }>(`/report/filesystem/saveInterface`, params);
  return res.body.success;
}
