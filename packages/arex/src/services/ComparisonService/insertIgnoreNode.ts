import { IgnoreNodeBase } from '@/services/ComparisonService/queryIgnoreNode';
import { request } from '@/utils';

export type DependencyParams = Pick<IgnoreNodeBase, 'operationType' | 'operationName'> | false;
export enum ExpirationType {
  permanent,
  temporary,
}

export type IgnoreExpiration = {
  expirationType: ExpirationType;
  expirationDate: number;
};

export type InterfaceIgnoreNode = {
  compareConfigType: number | null;
  fsInterfaceId: string | null;
} & IgnoreNodeBase &
  Partial<IgnoreExpiration>;

export async function insertIgnoreNode(params: IgnoreNodeBase | InterfaceIgnoreNode) {
  const res = await request.post<boolean>(
    '/report/config/comparison/exclusions/modify/INSERT',
    params,
  );
  return res.body;
}
