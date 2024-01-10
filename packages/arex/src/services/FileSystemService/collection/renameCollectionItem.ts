import { request } from '@/utils';

export type RenameCollectionItemReq = {
  id: string;
  newName: string;
  path: string[];
  userName: string;
};

export async function renameCollectionItem(params: RenameCollectionItemReq) {
  return request
    .post<{ success: boolean }>(`/webApi/filesystem/rename`, params)
    .then((res) => res.body.success);
}
