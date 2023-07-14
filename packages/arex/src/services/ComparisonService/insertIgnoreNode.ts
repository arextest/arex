import { request } from '@/utils';

import { OperationId } from '../ApplicationService';

export interface IgnoreNodeBase {
  appId?: string;
  operationId: OperationId<'Global'>;
  // 为 dependency 添加忽略项的两种方式
  // 1. 当 dependencyId 存在时传 dependencyId
  dependencyId: OperationId<'Global'>;
  // 2. 当 dependencyId 不存在时，传 categoryName 和 operationName
  categoryName?: string;
  operationName?: string;
  exclusions: string[];
}

export type DependencyParams = Pick<
  IgnoreNodeBase,
  'dependencyId' | 'categoryName' | 'operationName'
>;

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
