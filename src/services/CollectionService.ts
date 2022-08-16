import { message } from 'antd';

import request from '../api/axios';
import { collectionOriginalTreeToAntdTreeData } from '../helpers/collection/util';
import { QueryWorkspaceByIdReq, QueryWorkspaceByIdRes } from './CollectionService.type';

export interface NodeList {
  id: string;
  children: NodeList[];
  title: string;
  key: string;
  nodeType: number;
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
      }>(`/api/filesystem/queryWorkspaceById`, params)
      .then((res) => Promise.resolve(collectionOriginalTreeToAntdTreeData(res.body.fsTree.roots)));
  }
  static async addItem(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      request.post(`/api/filesystem/addItem`, params).then((res) => {
        if (res.responseStatusType.responseCode === 2) {
          message.error(res.responseStatusType.responseDesc);
          reject('e');
        } else {
          resolve(res);
        }
      });
    });
  }
  static async removeItem(params: any): Promise<any> {
    return request.post(`/api/filesystem/removeItem`, params);
  }
  static async rename(params: any): Promise<any> {
    return request.post(`/api/filesystem/rename`, params);
  }
  static async duplicate(params: any): Promise<any> {
    return request.post(`/api/filesystem/duplicate`, params);
  }
}
