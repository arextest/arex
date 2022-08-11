export type Workspace = {
  id: string;
  role: number;
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
