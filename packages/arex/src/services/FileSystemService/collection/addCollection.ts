import { request } from '@/utils';

export type AddCollectionReq = {
  id: string;
  userName: string;
  nodeName?: string;
  nodeType?: string;
  parentPath?: string[];
};

export type AddCollectionRes = {
  infoId: string;
  workspaceId: string;
  success: boolean;
};

export async function addCollection(params: AddCollectionReq) {
  const { nodeName = 'New Collection', nodeType = '3', parentPath = [], ...restParams } = params;
  return request
    .post<AddCollectionRes>(`/report/filesystem/addItem`, {
      nodeName,
      nodeType,
      parentPath,
      ...restParams,
    })
    .then((res) => Promise.resolve(res.body));
}
