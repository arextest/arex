import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

export type MoveCollectionItemReq = {
  id: string; //workspaceId
  toIndex: number;
  fromInfoId: string;
  fromNodeType: CollectionNodeType;
  toParentInfoId?: string;
  toParentNodeType?: CollectionNodeType;
};

export async function moveCollectionItem(params: MoveCollectionItemReq) {
  return request
    .post<{ success: boolean }>(`/webApi/filesystem/move`, params)
    .then((res) => res.body.success);
}
