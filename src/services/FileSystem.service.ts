import request from '../helpers/api/axios';
import { BaseInterface, PinkMockReq, SaveCaseReq, SaveInterfaceReq } from './FileSystem.type';

export class FileSystemService {
  static async rename(params: any): Promise<any> {
    return request.post(`/report/filesystem/rename`, params);
  }

  static async queryInterface(params: { id: string }) {
    const res = await request.post<BaseInterface>(`/report/filesystem/queryInterface`, params);
    const {
      body: { address, testAddress, ...rest },
    } = res;
    return {
      ...rest,
      method: address?.method,
      endpoint: address?.endpoint,
      compareMethod: testAddress?.method,
      compareEndpoint: testAddress?.endpoint,
      address,
      testAddress,
    };
  }

  static async saveInterface(params: SaveInterfaceReq) {
    const res = await request.post<{ success: boolean }>(
      `/report/filesystem/saveInterface`,
      params,
    );
    return res.body.success;
  }

  static async saveCase(params: SaveCaseReq) {
    const res = await request.post<{ success: boolean }>(`/report/filesystem/saveCase`, params);
    return res.body.success;
  }

  static async queryCase(params: { id: string; getCompareMsg?: boolean }) {
    const res = await request.post<BaseInterface>(`/report/filesystem/queryCase`, params);
    const {
      body: { address, testAddress, ...rest },
    } = res;
    return {
      ...rest,
      method: address?.method,
      endpoint: address?.endpoint,
      compareMethod: testAddress?.method,
      compareEndpoint: testAddress?.endpoint,
      address,
      testAddress,
    };
  }

  static async importFile(params: any) {
    return request.post<any>(`/report/filesystem/import`, params);
  }

  static async pinMock(params: PinkMockReq) {
    const res = await request.post<{ success: boolean }>(`/report/filesystem/pinMock`, params);
    return res.body.success;
  }
}
