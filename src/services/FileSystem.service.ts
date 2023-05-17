import request from '../helpers/api/axios';
import { BaseInterface, PinkMockReq, SaveCaseReq, SaveInterfaceReq } from './FileSystem.type';
const emptyQueryInterfaceResBody = {
  id: '',
  name: 'New Request',
  address: {
    method: 'GET',
    endpoint: '',
  },
  preRequestScripts: [],
  testScripts: [],
  body: {
    contentType: 'application/json',
    body: '',
  },
  headers: [
    {
      key: 'Content-Type',
      value: 'application/json',
      active: true,
    },
  ],
  params: [],
  auth: null,
  testAddress: {
    method: 'GET',
    endpoint: '',
  },
  description: '',
  customTags: null,
  operationId: null,
  operationResponse: null,
};
export class FileSystemService {
  static async rename(params: any): Promise<any> {
    return request.post(`/report/filesystem/rename`, params);
  }

  static async queryInterface(params: { id: string }) {
    const res = await request
      .post<BaseInterface>(`/report/filesystem/queryInterface`, params)
      .then((res) => {
        // id不合法时
        if (res.body === null) {
          return {
            body: emptyQueryInterfaceResBody,
          };
        } else {
          return res;
        }
      });
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
      headers: (rest.headers || []).sort((a, b) => {
        return -(a.key.includes('arex') ? 1 : -1) + (b.key.includes('arex') ? 1 : -1);
      }),
      params: rest.params || [],
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

  static async queryCase(params: { id: string; getCompareMsg?: boolean; parentId?: string }) {
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
      parentValue: params.parentId ? await this.queryInterface({ id: params.parentId }) : undefined,
      preRequestScripts: rest.preRequestScripts || [],
      headers: (rest.headers || []).sort((a, b) => {
        return -(a.key.includes('arex') ? 1 : -1) + (b.key.includes('arex') ? 1 : -1);
      }),
      params: rest.params || [],
    };
  }

  static async importFile(params: any) {
    return request.post<any>(`/report/filesystem/import`, params);
  }

  static async pinMock(params: PinkMockReq) {
    const res = await request.post<{ success: boolean }>(`/report/filesystem/pinMock`, params);
    return res.body.success;
  }

  static async initBatchCompareReport(params: any) {
    const res = await request.post(`/report/batchcomparereport/initBatchCompareReport`, params);
    return res.body;
  }

  static async updateBatchCompareCase(params: any) {
    const res = await request.post(`/report/batchcomparereport/updateBatchCompareCase`, params);
    return res.body;
  }

  static async queryBatchCompareProgress(params: any) {
    const res = await request.post(`/report/batchcomparereport/queryBatchCompareProgress`, params);
    return res.body;
  }

  static async queryBatchCompareSummary(params: any) {
    const res = await request.post(`/report/batchcomparereport/queryBatchCompareSummary`, params);
    return res.body;
  }

  static async queryBatchCompareCaseMsgWithDiff(params: any) {
    const res = await request.post(
      `/report/batchcomparereport/queryBatchCompareCaseMsgWithDiff`,
      params,
    );
    return res.body;
  }
}
