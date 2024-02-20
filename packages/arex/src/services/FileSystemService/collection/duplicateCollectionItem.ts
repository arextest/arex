import { request } from '@/utils';

export type DuplicateCollectionItemReq = {
  id: string;
  path: string[];
  userName: string;
};

export type DuplicateCollectionItemRes = {
  infoId: string;
  workspaceId: string;
  success: boolean;
};

export async function duplicateCollectionItem(params: DuplicateCollectionItemReq) {
  return request.post<DuplicateCollectionItemRes>(`/webApi/filesystem/duplicate`, params);
}
