import { request } from '@/utils';

export type MoveCollectionItemReq = {
  id: string; //workspaceId
  toParentPath: string[];
  fromNodePath: string[];
  toIndex: number;
};

export async function moveCollectionItem(params: MoveCollectionItemReq) {
  return request
    .post<{ success: boolean }>(`/webApi/filesystem/move`, params)
    .then((res) => res.body.success);
}
