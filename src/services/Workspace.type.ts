import { RoleEnum } from '../constant';

export type Workspace = {
  id: string;
  role: RoleEnum;
  workspaceName: string;
};

export interface QueryUsersByWorkspaceReq {
  workspaceId: string;
}

export type WorkspaceUser = {
  userName: string;
  role: number;
  status: number;
};
export interface QueryUsersByWorkspaceRes {
  users: WorkspaceUser[];
}
// ------ /api/filesystem/addItem ------

export interface CreateWorkspaceReq {
  userName: string;
  workspaceName: string;
}

export interface CreateWorkspaceRes {
  infoId: string;
  workspaceId: string;
  success: boolean;
}

export interface DeleteWorkspaceReq {
  userName: string;
  workspaceId: string;
}

// ------ /api/filesystem/validInvitation ------
export type ValidInvitationReq = {
  token: string;
  userName: string;
  workspaceId: string;
};

export type ValidInvitationRes = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

// ------ /api/filesystem/changeRole ------
export type ChangeRoleReq = {
  workspaceId: string;
  userName: string;
  role: RoleEnum;
};

// ------ /api/filesystem/removeUserFromWorkspace ------
export type RemoveUserFromWorkspaceReq = {
  workspaceId: string;
  userName: string;
};
