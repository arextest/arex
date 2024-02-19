import { request } from '@/utils';

import { CollectionType } from '../queryCollectionByWorkspace';

export interface SearchCollectionItemsReq {
  workspaceId: string;
  pageSize: number;
  keywords: string;
}

export interface SearchCollectionItemsRes {
  caseNodes: CollectionType[];
  folderNodes: CollectionType[];
  interfaceNodes: CollectionType[];
}

export async function searchCollectionItems(params: SearchCollectionItemsReq) {
  const res = await request.post<SearchCollectionItemsRes>(
    `/webApi/filesystem/searchWorkspaceItems`,
    params,
  );
  return res.body;
}
