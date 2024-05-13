import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

import { QueryWorkspaceByIdRes } from '../queryCollectionByWorkspace';

export interface GetCollectionItemTreeReq {
  workspaceId: string;
  infoId: string;
  nodeType: CollectionNodeType;
}

export async function getCollectionItemTree(params: GetCollectionItemTreeReq) {
  const res = await request.post<QueryWorkspaceByIdRes>(
    `/webApi/filesystem/getWorkspaceItemTree`,
    params,
  );
  return res.body.fsTree;
}
