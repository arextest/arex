import { request } from '../../utils';

export type CreateWorkspaceReq = {
  userName: string;
  workspaceName: string;
};

export type CreateWorkspaceRes = {
  infoId: string;
  workspaceId: string;
  success: boolean;
};

export default async function createWorkspace({ userName, workspaceName }: CreateWorkspaceReq) {
  return request
    .post<CreateWorkspaceRes>(`/report/filesystem/addItem`, {
      nodeName: 'New Collection',
      nodeType: '3',
      userName,
      workspaceName,
    })
    .then((res) => Promise.resolve(res.body));
}
