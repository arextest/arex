import { request } from '@/utils';

export interface QueryContractReq {
  appId: string;
  operationId?: string; //queryEntryPoint
  //queryDependency
  operationType?: string;
  operationName?: string;
}

export type Contract = string | null;
export interface QueryContractRes {
  id: string;
  dataChangeCreateTime: number;
  dataChangeUpdateTime: number;
  appId: string;
  isEntry: boolean;
  operationId: string;
  operationName: string;
  operationType: string;
  contract: Contract;
}

export async function queryContract(params: QueryContractReq) {
  const res = await request.post<QueryContractRes>('/report/report/queryContract', params, {
    headers: { 'App-Id': params.appId },
  });

  return res.body;
}
