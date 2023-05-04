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

export default async function queryRequest(createWorkspaceReq: CreateWorkspaceReq) {
  return request
    .post<CreateWorkspaceRes>(`/report/filesystem/queryInterface`, createWorkspaceReq)
    .then((res) => Promise.resolve(res.body));
}
