import { CollectionNodeType } from '@/constant';
import { QueryWorkspaceByIdRes } from '@/services/FileSystemService';
import { request } from '@/utils';

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
  return res.body;
}
