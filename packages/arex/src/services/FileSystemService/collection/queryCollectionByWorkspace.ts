import { RequestMethodEnum } from '@arextest/arex-core';
import { DataNode } from 'antd/lib/tree';

import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

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

export type QueryWorkspaceByIdRes = {
  fsTree: {
    id: string;
    roots: CollectionType[];
    userName: string;
    workspaceName: string;
  };
};

export async function queryCollectionByWorkspace(params: { id: string }) {
  return request
    .post<QueryWorkspaceByIdRes>(`/webApi/filesystem/queryWorkspaceById`, params)
    .then((res) => res.body.fsTree);
}
