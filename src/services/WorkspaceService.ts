import axios from 'axios';

import request from '../api/axios';
import { Workspace } from '../layouts/MainBox';


export class WorkspaceService {
  static listWorkspace({ userName }: { userName: string }) {
    return request
      .post<{ workspaces: Workspace[] }>(`/api/filesystem/queryWorkspacesByUser`, {
        userName,
      })
      .then((res) => res.body.workspaces);
  }
  static createWorkspace({ userName, workspaceName }) {
    return request
      .post(`/api/filesystem/addItem`, {
        nodeName: 'New Collection',
        nodeType: '3',
        userName: userName,
        workspaceName: workspaceName,
      })
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
    return axios.post(`/api/filesystem/deleteWorkspace`,{
      "userName": localStorage.getItem('email'),
      "workspaceId": workspaceId
    }).then((res) => res);
  }

  static inviteToWorkspace(params) {
    return axios.post(`/api/filesystem/inviteToWorkspace`, params);
  }
}
