import { request } from '@/utils';

export interface OverwriteContractReq {
  // 只需要传一个
  contractId?: string; //queryDependency
  operationId?: string; //queryEntryPoint
  operationResponse: string;
}

export async function overwriteContract(params: OverwriteContractReq) {
  const res = await request.post<boolean>('/report/report/overwriteContract', params);

  return res.body;
}
