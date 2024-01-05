import { request } from '@/utils';

export type RemoveCollectionItemReq = {
  id: string;
  removeNodePath: string[];
  userName: string;
};

export async function removeCollectionItem(params: RemoveCollectionItemReq) {
  return request.post('/webApi/filesystem/removeItem', params);
}
