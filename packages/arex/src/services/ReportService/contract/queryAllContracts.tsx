import { request } from '@/utils';

import { QueryContractRes } from './queryContract';

export interface QueryAllContractsReq {
  appId: string;
  operationId?: string;
}
export async function queryAllContracts(params: QueryAllContractsReq) {
  const res = await request.post<QueryContractRes[]>('/report/report/queryAllContracts', params);

  return res.body;
}
