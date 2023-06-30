import { RoleEnum } from '@arextest/arex-core';

import { request } from '@/utils';

export type InviteToWorkspaceReq = {
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
    `/report/filesystem/inviteToWorkspace`,
    params,
  );
  return res.body;
}
