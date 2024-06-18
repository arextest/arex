import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

export type AddCollectionReq = {
  id: string;
  userName: string;
  nodeName?: string;
  nodeType?: CollectionNodeType;
  parentPath?: string[];
  caseSourceType?: number;
};

export type AddCollectionRes = {
  infoId: string;
  workspaceId: string;
  success: boolean;
};

export async function addCollectionItem(params: AddCollectionReq) {
  const { nodeName = 'New Collection', nodeType = 3, ...restParams } = params;
  const res = await request.post<AddCollectionRes>(`/webApi/filesystem/addItem`, {
    nodeName,
    nodeType,
    ...restParams,
  });

  return res.body;
}
