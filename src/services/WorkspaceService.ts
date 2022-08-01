import axios from 'axios';

import request from '../api/axios';

export type Workspace = { id: string; role: number; workspaceName: string };

export class WorkspaceService {
  static listWorkspace({ userName }: { userName: string }) {
    return request
      .post<{ workspaces: Workspace[] }>(`/api/filesystem/queryWorkspacesByUser`, {
        userName,
      })
      .then((res) => res.body.workspaces);
  }
  static createWorkspace({ userName, workspaceName }) {
    return axios
      .post(`/api/filesystem/addItem`, {
        nodeName: 'New Collection',
        nodeType: '3',
        userName: userName,
        workspaceName: workspaceName,
      })
      .then((res) => res);
  }

  static renameWorkspace({ workspaceId, newName }) {
    return axios
      .post(`/api/filesystem/renameWorkspace`, {
        id: workspaceId,
        workspaceName: newName,
      })
      .then((res) => res);
  }

  static deleteWorkspace({ workspaceId }) {
    return axios.delete(`/api/filesystem/workspace/${workspaceId}`).then((res) => res);
  }
}
