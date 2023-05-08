import { request } from '@/utils';

export async function leaveWorkspace(params: { workspaceId: string }) {
  return request
    .post<{ success: boolean }>(`/report/filesystem/leaveWorkspace`, params)
    .then((res) => res.body.success);
}
