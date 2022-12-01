import { RoleEnum } from '../constant';

export type Workspace = {
  id: string;
  role: RoleEnum;
  workspaceName: string;
};

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
