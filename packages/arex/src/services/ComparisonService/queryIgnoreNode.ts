import { OperationId, OperationType } from '@/services/ApplicationService';
import { QueryIgnoreNode } from '@/services/ComparisonService/queryInterfaceIgnoreNode';
import { request } from '@/utils';

export interface QueryNodeReq<T extends OperationType> {
  appId: string;
  operationId?: OperationId<T>;
}

export async function queryIgnoreNode(params: QueryNodeReq<'Global'>) {
  const res = await request.get<QueryIgnoreNode[]>(
    '/report/config/comparison/exclusions/useResultAsList',
    { ...params, operationId: params.operationId || undefined },
  );
  return res.body
    .map<QueryIgnoreNode>((item) => ({
      ...item,
      path: item.exclusions.concat(['']).join('/'),
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
}
