import { message } from 'antd';

import request from '../helpers/api/axios';
import { collectionOriginalTreeToAntdTreeData } from '../helpers/collection/util';
import { QueryLabelsReq, QueryLabelsRes, RemoveLabelsReq, SaveLabelsReq } from './Collection.type';
import { SaveCaseReq } from './FileSystem.type';

export interface NodeObject {
  id: string;
  children: NodeObject[];
  title: string;
  key: string;
  nodeType: number;
  method: string;
}

export class CollectionService {
  static listCollection(params: { id: string }) {
    return request
      .post<{
        fsTree: {
          id: string;
          roots: any[];
          userName: string;
          workspaceName: string;
        };
      }>(`/report/filesystem/queryWorkspaceById`, params)
      .then((res) => Promise.resolve(collectionOriginalTreeToAntdTreeData(res.body.fsTree.roots)));
  }
  static async addItem(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      request.post(`/report/filesystem/addItem`, params).then((res: any) => {
        if (res.responseStatusType.responseCode === 2) {
          reject(res.responseStatusType.responseDesc);
        } else {
          resolve(res);
        }
      });
    });
  }
  static async removeItem(params: any): Promise<any> {
    return request.post(`/report/filesystem/removeItem`, params);
  }
  static async rename(params: any): Promise<any> {
    return request.post(`/report/filesystem/rename`, params);
  }
  static async duplicate(params: any): Promise<any> {
    return request.post(`/report/filesystem/duplicate`, params);
  }
  static async move(params: any): Promise<any> {
    return request.post(`/report/filesystem/move`, params);
  }

  //   Labels
  static async queryLabels(params: QueryLabelsReq) {
    const res = await request.post<QueryLabelsRes>(
      `/report/label/queryLabelsByWorkspaceId`,
      params,
    );
    return res.body.labels;
  }

  static async removeLabels(params: RemoveLabelsReq) {
    const res = await request.post<{ success: boolean }>(`/report/label/remove`, params);
    return res.body.success ? Promise.resolve(res.body) : Promise.reject({ success: false });
  }

  static async saveLabels(params: SaveLabelsReq) {
    const res = await request.post<{ success: boolean }>(`/report/label/save`, params);
    return res.body.success ? Promise.resolve(res.body) : Promise.reject({ success: false });
  }
}
