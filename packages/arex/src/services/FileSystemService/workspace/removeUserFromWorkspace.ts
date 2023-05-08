import { request } from '@/utils';

export type RemoveUserFromWorkspaceReq = {
  workspaceId: string;
  userName: string;
};

export async function removeUserFromWorkspace(params: RemoveUserFromWorkspaceReq) {
  return request
    .post(`/report/filesystem/removeUserFromWorkspace`, params)
    .then((res) => res.responseStatusType);
}
