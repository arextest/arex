import { RequestMethodEnum } from '@arextest/arex-core';

import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

export type CollectionType<T = NonNullable<unknown>> = {
  caseSourceType: number; // 0, 1
  children: CollectionType<T>[];
  infoId: string;
  labelIds: string | null;
  method: RequestMethodEnum | null;
  nodeName: string;
  nodeType: CollectionNodeType;
  existChildren?: boolean | null;
  isLeaf?: boolean;
} & T;

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
    .post<QueryWorkspaceByIdRes>(`/webApi/filesystem/queryWorkspaceById`, params)
    .then((res) => res.body.fsTree);
}
