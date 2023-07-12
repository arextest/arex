import { request } from '@/utils';

export interface AddDependencyToSystemReq {
  appId: string;
  operationId: string;
  operationType: string;
  operationName: string;
  msg: string;
}

export interface AddDependencyToSystemRes {
  appId: string;
  operationId: string;
  dependencyId: string;
}

export async function addDependencyToSystem(params: AddDependencyToSystemReq) {
  const res = await request.post<AddDependencyToSystemRes>(
    '/report/report/addDependencyToSystem',
    params,
  );

  return res.body;
}
