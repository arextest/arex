import axios from "axios";

export class WorkspaceService {
  static listWorkspace() {
    return axios.post(`/api/filesystem/queryWorkspacesByUser`, {
      userName: "zt",
    }).then(res=>res.data.body.workspaces);
  }
}
