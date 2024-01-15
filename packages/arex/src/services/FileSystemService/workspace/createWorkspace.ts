import { request } from '@/utils';

export type CreateWorkspaceReq = {
  nodeName?: string;
  nodeType?: string;
  userName: string;
  workspaceName: string;
};

export type CreateWorkspaceRes = {
  infoId: string;
  workspaceId: string;
  success: boolean;
};

export async function createWorkspace(params: CreateWorkspaceReq) {
  const { nodeName = 'New Collection', nodeType = '3', ...restParams } = params;
  return request
    .post<CreateWorkspaceRes>(`/webApi/filesystem/addItem`, {
      nodeName,
      nodeType,
      ...restParams,
    })
    .then((res) => res.body);
}
