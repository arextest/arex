import { OperationId, OperationType } from '@/services/ApplicationService';
import { request } from '@/utils';

import { IgnoreExpiration } from './insertIgnoreNode';

export interface QueryNodeReq<T extends OperationType> {
  appId: string;
  operationId?: OperationId<T>;
  operationType?: string;
  operationName?: string;
}

export interface IgnoreNodeBase {
  appId?: string;
  operationId: OperationId<'Global'>;
  // 为 dependency 添加忽略项
  operationType?: string;
  operationName?: string;
  exclusions: string[];
  path?: string;
}

export type QueryIgnoreNode = {
  modifiedTime: string;
  id: string;
} & IgnoreNodeBase &
  IgnoreExpiration;

export async function queryIgnoreNode(params: QueryNodeReq<'Global'>) {
  const res = await request.post<QueryIgnoreNode[]>(
    '/report/config/comparison/exclusions/queryComparisonConfig',
    { ...params, operationId: params.operationId || undefined },
    {
      headers: { 'App-Id': params.appId },
    },
  );
  return res.body
    .map<QueryIgnoreNode>((item) => ({
      ...item,
      path: item.exclusions.concat(['']).join('/'),
    }))
    .sort((a, b) => a.path!.localeCompare(b.path!));
}
