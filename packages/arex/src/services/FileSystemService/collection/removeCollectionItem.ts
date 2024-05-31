import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

export type RemoveCollectionItemReq = {
  id: string;
  infoId: string;
  nodeType: CollectionNodeType;
};

export async function removeCollectionItem(params: RemoveCollectionItemReq) {
  const res = await request.post<{ success: boolean }>('/webApi/filesystem/removeItem', params);
  return res.body.success;
}
