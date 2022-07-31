import axios from 'axios';

export class WorkspaceService {
  static listWorkspace({ userName }) {
    return axios
      .post(`/api/filesystem/queryWorkspacesByUser`, {
        userName: userName,
      })
      .then((res) => res.data.body.workspaces);
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

  static renameWorkspace({ workspaceId,newName }) {
    return axios
      .post(`/api/filesystem/renameWorkspace`, {
        "id": workspaceId,
        "workspaceName": newName
      })
      .then((res) => res);
  }

  static deleteWorkspace({ workspaceId }) {
    return axios
      .delete(`/api/filesystem/workspace/${workspaceId}`)
      .then((res) => res);
  }
}
