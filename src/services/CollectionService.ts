import axios from 'axios';

import request from '../api/axios';
import { collectionOriginalTreeToAntdTreeData } from '../helpers/collection/util';
import { QueryWorkspaceByIdReq, QueryWorkspaceByIdRes } from './CollectionService.type';
import { message } from 'antd';

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
      axios.post(`/api/filesystem/addItem`, params).then((res) => {
        if (res.data.responseStatusType.responseCode === 2) {
          message.error(res.data.responseStatusType.responseDesc);
          reject('e');
        } else {
          resolve(res);
        }
      });
    });
  }

  static async removeItem(params: any): Promise<any> {
    return axios.post(`/api/filesystem/removeItem`, params);
  }

  static async rename(params: any): Promise<any> {
    return axios.post(`/api/filesystem/rename`, params);
  }

  static async queryWorkspaceById({ id }: QueryWorkspaceByIdReq) {
    return axios.post<QueryWorkspaceByIdRes>(`/api/filesystem/queryWorkspaceById`, {
      id,
    });
  }
}
