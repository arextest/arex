import axios from "axios";

export class WorkspaceService {
  static queryWorkspacesByUser(){
    return axios.post(`/api/filesystem/queryWorkspacesByUser`, {
      userName: "zt",
    }).then((r) => {
      console.log(r, "rrr");
      return r;
    })
  }
}
