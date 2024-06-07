import { CollectionNodeType } from '@/constant';
import { CollectionType } from '@/services/FileSystemService';
import { request } from '@/utils';

export interface GetCollectionItemTreeReq {
  workspaceId: string;
  infoId: string;
  nodeType: CollectionNodeType;
}

export type QueryWorkspaceByIdRes = {
  fsTree: {
    id: string;
    roots: CollectionType[];
    userName: string;
    workspaceName: string;
  };
  path: string[];
};

export async function getCollectionItemTree(params: GetCollectionItemTreeReq) {
  const res = await request.post<QueryWorkspaceByIdRes>(
    `/webApi/filesystem/getWorkspaceItemTree`,
    params,
  );
  return res.body;
}
