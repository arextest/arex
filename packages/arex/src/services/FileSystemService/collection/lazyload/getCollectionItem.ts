import { CollectionType } from '@/services/FileSystemService';
import { request } from '@/utils';

export type GetCollectionItemReq = {
  workspaceId: string;
  parentIds?: string[];
};

export type GetCollectionItemRes = {
  node: CollectionType;
};

export async function getCollectionItem(params: GetCollectionItemReq) {
  const res = await request.post<GetCollectionItemRes>(
    `/webApi/filesystem/getWorkspaceItem`,
    params,
  );
  return res.body.node;
}
