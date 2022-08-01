import axios from 'axios';

import request from '../api/axios';
import { collectionOriginalTreeToAntdTreeData } from '../helpers/collection/util';
import { QueryWorkspaceByIdReq, QueryWorkspaceByIdRes } from './CollectionService.type';

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
    return axios.post(`/api/filesystem/addItem`, params);
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
