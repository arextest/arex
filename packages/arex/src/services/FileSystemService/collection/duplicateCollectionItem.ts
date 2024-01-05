import { request } from '@/utils';

export type DuplicateCollectionItemReq = {
  id: string;
  path: string[];
  userName: string;
};

export async function duplicateCollectionItem(params: DuplicateCollectionItemReq) {
  return request.post(`/webApi/filesystem/duplicate`, params);
}
