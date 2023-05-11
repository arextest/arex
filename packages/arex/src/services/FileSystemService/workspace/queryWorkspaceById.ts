import { DataNode } from 'antd/lib/tree';
import { RequestMethodEnum } from 'arex-core';

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
}

export type QueryWorkspaceByIdRes = {
  fsTree: {
    id: string;
    roots: CollectionType[];
    userName: string;
    workspaceName: string;
  };
};

export async function queryWorkspaceById(params: { id: string }) {
  return request
    .post<QueryWorkspaceByIdRes>(`/report/filesystem/queryWorkspaceById`, params)
    .then((res) => res.body.fsTree);
}
