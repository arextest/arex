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
}
