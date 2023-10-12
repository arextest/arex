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
  const res = await request.post<boolean>('/report/report/overwriteContract', params, {
    headers: { 'App-Id': params.appId },
  });

  return res.body;
}
