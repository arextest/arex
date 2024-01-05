import { request } from '@/utils';

export interface OverwriteContractReq {
  appId?: string;
  operationId?: string; //overwriteEntryPoint
  //overwriteDependency
  operationName?: string;
  operationType?: string;
  operationResponse: string;
}

export async function overwriteContract(params: OverwriteContractReq) {
  const res = await request.post<boolean>('/webApi/report/overwriteContract', params);

  return res.body;
}
