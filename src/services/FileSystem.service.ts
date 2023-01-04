import request from '../helpers/api/axios';
import {
  PinkMockReq,
  QueryCaseRes,
  QueryInterfaceRes,
  SaveCaseReq,
  SaveInterfaceReq,
} from './FileSystem.type';

export class FileSystemService {
  static async rename(params: any): Promise<any> {
    return request.post(`/api/filesystem/rename`, params);
  }

  static async queryInterface(params: { id: string }) {
    const res = await request.post<QueryInterfaceRes>(`/api/filesystem/queryInterface`, params);
    const {
      body: { address, testAddress, ...rest },
    } = res;
    return {
      ...rest,
      method: address.method,
      endpoint: address.endpoint,
      compareMethod: testAddress.method,
      compareEndpoint: testAddress.endpoint,
    };
  }

  static async saveInterface(params: SaveInterfaceReq) {
    const res = await request.post<{ success: boolean }>(`/api/filesystem/saveInterface`, params);
    return res.body.success;
  }

  static async saveCase(params: SaveCaseReq) {
    const res = await request.post<{ success: boolean }>(`/api/filesystem/saveCase`, params);
    return res.body.success;
  }

  static async queryCase(params: { id: string }) {
    const res = await request.post<QueryCaseRes>(`/api/filesystem/queryCase`, params);
    const {
      body: { address, testAddress, ...rest },
    } = res;
    return {
      ...rest,
      method: address.method,
      endpoint: address.endpoint,
      compareMethod: testAddress.method,
      compareEndpoint: testAddress.endpoint,
    };
  }

  static async importFile(params: any) {
    return request.post<any>(`/api/filesystem/import`, params);
  }

  static async pinMock(params: PinkMockReq) {
    const res = await request.post<{ success: boolean }>(`/api/filesystem/pinMock`, params);
    return res.body.success;
  }
}
