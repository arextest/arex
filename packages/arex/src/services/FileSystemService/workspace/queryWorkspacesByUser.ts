import { Workspace } from '@/store/useWorkspaces';
import { request } from '@/utils';

export default async function queryWorkspacesByUser(params: { userName: string }) {
  return request
    .post<{ workspaces: Workspace[] }>(`/report/filesystem/queryWorkspacesByUser`, params)
    .then((res) => res.body.workspaces);
}
