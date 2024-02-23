import { request } from '@/utils';

export type RenameCollectionItemReq = {
  id: string;
  newName: string;
  path: string[];
  userName: string;
};

export type RenameCollectionItemRes = {
  success: boolean;
};

export async function renameCollectionItem(params: RenameCollectionItemReq) {
  return request
    .post<RenameCollectionItemRes>(`/webApi/filesystem/rename`, params)
    .then((res) => res.body.success);
}
