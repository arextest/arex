import { request } from '@/utils';

export interface QueryContractReq {
  // 只需要传一个
  contractId?: string; //queryDependency
  operationId?: string; //queryEntryPoint
}

export type Contract = string;
export interface QueryContractRes {
  contract: Contract;
}

export async function queryContract(params: QueryContractReq) {
  const res = await request.post<QueryContractRes>('/report/report/queryContract', params);

  return res.body;
}
