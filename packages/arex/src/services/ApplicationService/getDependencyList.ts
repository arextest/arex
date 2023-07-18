import { request } from '@/utils';

export type DependencyData = {
  // dependencyId: string; // dependencyId 概念移除
  operationType: string;
  operationName: string;
  contract: string | null;
};

export type GetDependencyList = {
  status: number;
  modifiedTime: number;
  id: string;
  appId: string;
  serviceId: string;
  operationName: string;
  operationType: string;
  operationTypes: string[];
  operationResponse: string;
  responseContract: null;
  recordedCaseCount: null;
  dependencyList: DependencyData[];
};

export async function getDependencyList(params: { operationId: string }) {
  const res = await request.get<GetDependencyList>(
    '/report/config/applicationOperation/useResult/operationId/' + params.operationId,
  );
  return res.body;
}
