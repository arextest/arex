import { request } from '@/utils';

export type RemoveCollectionItemReq = {
  id: string;
  removeNodePath: string[];
};

export async function removeCollectionItem(params: RemoveCollectionItemReq) {
  const res = await request.post<{ success: boolean }>('/webApi/filesystem/removeItem', params);
  return res.body.success;
}
