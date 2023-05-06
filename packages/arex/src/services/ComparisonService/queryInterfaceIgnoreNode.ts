import { IgnoreNodeBase } from '@/services/ComparisonService/insertIgnoreNode';
import { request } from '@/utils';

export interface QueryInterfaceIgnoreNodeReq {
  interfaceId: string;
  operationId?: string | null;
}

export interface QueryIgnoreNode extends IgnoreNodeBase {
  modifiedTime: string;
  id: string;
  expirationType: number;
  expirationDate: string;
  path: string;
}

export interface QueryInterfaceIgnoreNode extends QueryIgnoreNode {
  compareConfigType: number | null;
  fsInterfaceId: string | null;
}

export async function queryInterfaceIgnoreNode(params: QueryInterfaceIgnoreNodeReq) {
  const res = await request.get<QueryInterfaceIgnoreNode[]>(
    '/report/config/comparison/exclusions/queryByInterfaceIdAndOperationId',
    params,
  );
  return res.body
    .map<QueryInterfaceIgnoreNode>((item) => ({
      ...item,
      path: item.exclusions.concat(['']).join('/'),
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
}
