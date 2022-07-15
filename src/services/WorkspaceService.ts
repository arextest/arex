import axios from "axios";

export class WorkspaceService {
  static queryWorkspacesByUser(){
    return axios.post(`/api/filesystem/queryWorkspacesByUser`, {
      userName: "zt",
    })
  }
}
