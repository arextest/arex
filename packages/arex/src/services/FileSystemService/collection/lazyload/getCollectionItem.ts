import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

export type GetCollectionItemReq = {
  workspaceId: string;
  parentInfoId?: string;
  parentNodeType?: CollectionNodeType;
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
