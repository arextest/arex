import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

export type RenameCollectionItemReq = {
  id: string;
  infoId: string;
  nodeType: CollectionNodeType;
  newName: string;
};

export type RenameCollectionItemRes = {
  success: boolean;
};

export async function renameCollectionItem(params: RenameCollectionItemReq) {
  return request
    .post<RenameCollectionItemRes>(`/webApi/filesystem/rename`, params)
    .then((res) => res.body.success);
}
