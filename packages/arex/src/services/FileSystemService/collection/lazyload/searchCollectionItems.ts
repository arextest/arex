import { OperatorType } from '@arextest/arex-core';
import React from 'react';

import { CollectionType } from '@/services/FileSystemService';
import { request } from '@/utils';

export interface SearchCollectionItemsReq {
  workspaceId: string;
  pageSize: number;
  keywords?: string;
  labels?: {
    key: string;
    operator: OperatorType;
    value: React.Key;
  }[];
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
