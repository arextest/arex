import axios from "axios";
import {
  QueryWorkspaceByIdReq,
  QueryWorkspaceByIdRes,
} from "./CollectionService.type";
export class CollectionService {
  static listCollection(params: { id: string }) {
    return axios.post(`/api/filesystem/queryWorkspaceById`, params);
  }

  static async addItem(params: any): Promise<any> {
    return axios.post(`/api/filesystem/addItem`, params);
  }

  static async removeItem(params: any): Promise<any> {
    return axios.post(`/api/filesystem/removeItem`, params);
  }

  static async rename(params: any): Promise<any> {
    return axios.post(`/api/filesystem/rename`, params);
  }

  static async queryWorkspaceById({ id }: QueryWorkspaceByIdReq) {
    return axios.post<QueryWorkspaceByIdRes>(
      `/api/filesystem/queryWorkspaceById`,
      {
        id,
      },
    );
  }
}
