import { request } from '@/utils';

export type MoveCollectionItemReq = {
  toParentPath: string[];
  fromNodePath: string[];
  id: string; //workspaceId
  toIndex: number;
};

export async function moveCollectionItem(params: MoveCollectionItemReq) {
  return request
    .post<{ success: boolean }>(`/report/filesystem/move`, params)
    .then((res) => res.body.success);
}
