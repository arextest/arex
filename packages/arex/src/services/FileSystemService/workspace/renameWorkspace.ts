import { request } from '@/utils';

export async function renameWorkspace(params: {
  id: string;
  workspaceName: string;
  userName: string;
}) {
  return request
    .post<{ success: boolean }>(`/report/filesystem/renameWorkspace`, params)
    .then((res) => res.body.success);
}
