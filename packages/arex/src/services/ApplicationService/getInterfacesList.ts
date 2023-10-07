import { objectArrayFilter } from '@arextest/arex-core';

import { request } from '@/utils';

export type OperationType = 'Global' | 'Interface';
export type OperationIdGlobal = string | null | undefined;
export type OperationIdInterface = string;

export type OperationId<T extends OperationType> = T extends 'Global'
  ? OperationIdGlobal
  : OperationIdInterface;

export type OperationInterface<T extends OperationType = 'Global'> = {
  status?: number;
  modifiedTime?: number;
  id: OperationId<T>;
  appId?: string;
  serviceId?: string;
  operationName: string;
  operationType?: number;
  operationResponse?: string | null;
  recordedCaseCount?: number | null;
};

export type OperationData<T extends OperationType> = {
  status: number;
  modifiedTime: number;
  id: string;
  appId: string;
  serviceName: string;
  serviceKey: string;
  operationList: OperationInterface<T>[];
};

export type QueryInterfacesListRes<T extends OperationType> = OperationData<T>[];

export async function queryInterfacesList<T extends OperationType>(params: { id: string }) {
  const res = await request.get<QueryInterfacesListRes<T>>(
    '/report/config/applicationService/useResultAsList/appId/' + params.id,
  );
  return objectArrayFilter<OperationInterface<T>>(
    res.body.reduce<OperationInterface<T>[]>((list, cur) => {
      list.push(...cur.operationList);
      return list;
    }, []),
    'id',
  )
    .filter((operation) => operation.operationName)
    .sort((a, b) => a.operationName.localeCompare(b.operationName));
}
