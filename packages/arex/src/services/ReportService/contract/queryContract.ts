import { request } from '@/utils';

export interface QueryContractReq {
  // 只需要传一个
  appId?: string; //queryGlobal
  contractId?: string; //queryDependency
  operationId?: string; //queryEntryPoint
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
  const res = await request.post<QueryContractRes>('/report/report/queryContract', params);

  return res.body;
}
