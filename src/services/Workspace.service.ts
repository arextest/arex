import request from '../helpers/api/axios';
import { CreateWorkspaceReq, CreateWorkspaceRes, Workspace } from './Workspace.type';

export default class WorkspaceService {
  static listWorkspace({ userName }: { userName: string }) {
    return request
      .post<{ workspaces: Workspace[] }>(`/api/filesystem/queryWorkspacesByUser`, {
        userName,
      })
      .then((res) => res.body.workspaces);
  }
  static createWorkspace({ userName, workspaceName }: CreateWorkspaceReq) {
    return request
      .post<CreateWorkspaceRes>(`/api/filesystem/addItem`, {
        nodeName: 'New Collection',
        nodeType: '3',
        userName: userName,
        workspaceName: workspaceName,
      })
      .then((res) => Promise.resolve(res.body));
  }

  static renameWorkspace({ workspaceId, newName, userName }) {
    return request
      .post(`/api/filesystem/renameWorkspace`, {
        id: workspaceId,
        workspaceName: newName,
        userName,
      })
      .then((res) => res);
  }

  static deleteWorkspace(params: { userName: string; workspaceId: string }) {
    return request.post(`/api/filesystem/deleteWorkspace`, params).then((res) => res);
  }

  static inviteToWorkspace(params) {
    return request.post(`/api/filesystem/inviteToWorkspace`, params);
  }

  static validInvitation(params) {
    return request.post(`/api/filesystem/validInvitation`, params);
  }
}
