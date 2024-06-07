import { RequestMethodEnum } from '@arextest/arex-core';
import { DataNode } from 'antd/lib/tree';

import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

export type GetCollectionItemReq = {
  workspaceId: string;
  parentInfoId?: string;
  parentNodeType?: CollectionNodeType;
};

export interface CollectionType extends DataNode {
  caseSourceType: number; // 0, 1
  children: CollectionType[];
  infoId: string;
  labelIds: string | null;
  method: RequestMethodEnum | null;
  nodeName: string;
  nodeType: CollectionNodeType;
  existChildren?: boolean | null;
  isLeaf?: boolean;
}

export type GetCollectionItemRes = {
  node: CollectionType;
  path: string[];
};

export async function getCollectionItem(params: GetCollectionItemReq) {
  const res = await request.post<GetCollectionItemRes>(
    `/webApi/filesystem/getWorkspaceItem`,
    params,
  );
  return res.body;
}
