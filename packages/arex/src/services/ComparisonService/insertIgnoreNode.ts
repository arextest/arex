import { IgnoreNodeBase } from '@/services/ComparisonService/queryIgnoreNode';
import { request } from '@/utils';

export type DependencyParams = Pick<IgnoreNodeBase, 'operationType' | 'operationName'> | false;

export interface InterfaceIgnoreNode extends IgnoreNodeBase {
  compareConfigType: number | null;
  fsInterfaceId: string | null;
}

export async function insertIgnoreNode(params: IgnoreNodeBase | InterfaceIgnoreNode) {
  const res = await request.post<boolean>(
    '/report/config/comparison/exclusions/modify/INSERT',
    params,
  );
  return res.body;
}
