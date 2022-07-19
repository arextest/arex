import request from "./axios";
import {
  QueryInterfaceReq,
  QueryInterfaceRes,
  QueryWorkspaceByIdReq,
  QueryWorkspaceByIdRes,
  SaveInterfaceReq,
  SaveInterfaceRes,
} from "./FileSystem.type";
export class FileSystemService {
  static async queryWorkspacesByUser({ id }: any): Promise<any> {
    return request.post(`/api/filesystem/queryWorkspacesByUser`, {
      userName: "zt",
    });
  }

  static async queryWorkspaceById({ id }: QueryWorkspaceByIdReq) {
    return request.post<QueryWorkspaceByIdRes>(
      `/api/filesystem/queryWorkspaceById`,
      {
        id,
      },
    );
  }

  static async addItem(params: any): Promise<any> {
    return request.post(`/api/filesystem/addItem`, params);
  }

  static async removeItem(params: any): Promise<any> {
    return request.post(`/api/filesystem/removeItem`, params);
  }

  static async rename(params: any): Promise<any> {
    return request.post(`/api/filesystem/rename`, params);
  }

  static async queryInterface(params: QueryInterfaceReq) {
    return request.post<QueryInterfaceRes>(
      `/api/filesystem/queryInterface`,
      params,
    );
  }

  static async saveInterface(params: SaveInterfaceReq) {
    return request.post<SaveInterfaceRes>(
      `/api/filesystem/saveInterface`,
      params,
    );
  }

  static async saveCase(params: SaveInterfaceReq) {
    return request.post<SaveInterfaceRes>(`/api/filesystem/saveCase`, params);
  }

  static async queryCase(params: any) {
    return request.post<any>(`/api/filesystem/queryCase`, params);
  }
}
