import { RoleEnum } from '@arextest/arex-core';

import { request } from '@/utils';

export type InviteToWorkspaceReq = {
  arexUiUrl: string;
  invitor: string;
  role: RoleEnum;
  userNames: string[];
  workspaceId: string;
};

export type InviteToWorkspaceRes = {
  successUsers: string[];
  failedUsers: string[];
  failReason?: string;
};

export async function inviteToWorkspace(params: InviteToWorkspaceReq) {
  const res = await request.post<InviteToWorkspaceRes>(
    `/webApi/filesystem/inviteToWorkspace`,
    params,
  );
  return res.body;
}
