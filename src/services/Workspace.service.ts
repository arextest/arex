import request from '../helpers/api/axios';
import {
  CreateWorkspaceReq,
  CreateWorkspaceRes,
  DeleteWorkspaceReq,
  QueryUsersByWorkspaceReq,
  QueryUsersByWorkspaceRes,
  ValidInvitationReq,
  ValidInvitationRes,
  Workspace,
} from './Workspace.type';

export default class WorkspaceService {
  static listWorkspace({ userName }: { userName: string }) {
    return request
      .post<{ workspaces: Workspace[] }>(`/report/filesystem/queryWorkspacesByUser`, {
        userName,
      })
      .then((res) => res.body.workspaces);
  }

  static queryUsersByWorkspace(params: QueryUsersByWorkspaceReq) {
    return request
      .post<QueryUsersByWorkspaceRes>(`/report/filesystem/queryUsersByWorkspace`, params)
      .then((res) => res.body.users);
  }

  static createWorkspace({ userName, workspaceName }: CreateWorkspaceReq) {
    return request
      .post<CreateWorkspaceRes>(`/report/filesystem/addItem`, {
        nodeName: 'New Collection',
        nodeType: '3',
        userName,
        workspaceName,
      })
      .then((res) => Promise.resolve(res.body));
  }

  static renameWorkspace({ workspaceId, newName, userName }: any) {
    return request.post(`/report/filesystem/renameWorkspace`, {
      id: workspaceId,
      workspaceName: newName,
      userName,
    });
  }

  static deleteWorkspace(params: DeleteWorkspaceReq) {
    return request
      .post<boolean>(`/report/filesystem/deleteWorkspace`, params)
      .then((res) => res.body);
  }

  static inviteToWorkspace(params: any) {
    return request.post(`/report/filesystem/inviteToWorkspace`, params);
  }

  static validInvitation(params: ValidInvitationReq) {
    return request.post<ValidInvitationRes>(`/report/filesystem/validInvitation`, params);
  }
}
