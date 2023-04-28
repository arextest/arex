import { request } from '../../utils';
import { OperationId } from '../ApplicationService';

export interface IgnoreNodeBase {
  appId?: string;
  operationId: OperationId<'Global'>;
  exclusions: string[];
}

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
