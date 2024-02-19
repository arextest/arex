import { CollectionType } from '@/services/FileSystemService';
import { request } from '@/utils';

export type GetWorkspaceItemReq = {
  workspaceId: string;
  parentIds?: string[];
};

export type GetWorkspaceItemRes = {
  node: CollectionType;
};

export async function getCollectionItem(params: GetWorkspaceItemReq) {
  const res = await request.post<GetWorkspaceItemRes>(
    `/webApi/filesystem/getWorkspaceItem`,
    params,
  );
  return res.body.node;
}
