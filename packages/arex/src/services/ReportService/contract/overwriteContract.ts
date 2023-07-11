import { request } from '@/utils';

export interface OverwriteContractReq {
  appId?: string;
  operationId?: string; //queryEntryPoint
  operationName?: string; //queryEntryPoint
  operationType?: string; //queryEntryPoint
  contractId?: string; //queryDependency
  operationResponse: string;
}

export async function overwriteContract(params: OverwriteContractReq) {
  const res = await request.post<boolean>('/report/report/overwriteContract', params);

  return res.body;
}
