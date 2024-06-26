import { CollectionNodeType } from '@/constant';
import { CollectionType } from '@/services/FileSystemService';
import { request } from '@/utils';

export type GetCollectionItemReq = {
  workspaceId: string;
  parentInfoId?: string;
  parentNodeType?: CollectionNodeType;
};

export type GetCollectionItemRes = {
  node: CollectionType;
  path: string[];
};

export async function getCollectionItem(params: GetCollectionItemReq) {
  const res = await request.post<GetCollectionItemRes>(
    `/webApi/filesystem/getWorkspaceItem`,
    params,
  );
  return res.body;
}
