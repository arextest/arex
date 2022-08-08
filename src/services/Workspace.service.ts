import request from '../api/axios';
import { Workspace } from './Workspace.type';

export class WorkspaceService {
  static listWorkspace({ userName }: { userName: string }) {
    return request
      .post<{ workspaces: Workspace[] }>(`/api/filesystem/queryWorkspacesByUser`, {
        userName,
      })
      .then((res) => res.body.workspaces);
  }
  static createWorkspace({ userName, workspaceName }) {
    return request.post(`/api/filesystem/addItem`, {
      nodeName: 'New Collection',
      nodeType: '3',
      userName: userName,
      workspaceName: workspaceName,
    });
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

  static deleteWorkspace({ workspaceId }) {
    return request
      .post(`/api/filesystem/deleteWorkspace`, {
        userName: localStorage.getItem('email'),
        workspaceId: workspaceId,
      })
      .then((res) => res);
  }

  static inviteToWorkspace(params) {
    return request.post(`/api/filesystem/inviteToWorkspace`, params);
  }
}
