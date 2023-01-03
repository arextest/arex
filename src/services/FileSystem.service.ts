import request from '../helpers/api/axios';
import {
  QueryCaseRes,
  QueryInterfaceRes,
  SaveInterfaceReq,
  SaveInterfaceRes,
} from './FileSystem.type';

export class FileSystemService {
  static async rename(params: any): Promise<any> {
    return request.post(`/api/filesystem/rename`, params);
  }

  static async queryInterface(params: { id: string }) {
    return request.post<QueryInterfaceRes>(`/api/filesystem/queryInterface`, params);
  }

  static async saveInterface(params: SaveInterfaceReq) {
    return request.post<SaveInterfaceRes>(`/api/filesystem/saveInterface`, params);
  }

  static async saveCase(params: SaveInterfaceReq) {
    return request.post<SaveInterfaceRes>(`/api/filesystem/saveCase`, params);
  }

  static async queryCase(params: { id: string }) {
    return request.post<QueryCaseRes>(`/api/filesystem/queryCase`, params);
  }

  static async importFile(params: any) {
    return request.post<any>(`/api/filesystem/import`, params);
  }
}
