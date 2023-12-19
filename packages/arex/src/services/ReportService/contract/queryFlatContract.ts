import { request } from '@/utils';

import { QueryContractReq } from './queryContract';

export async function queryFlatContract(params: QueryContractReq) {
  const res = await request.post<string[]>('/report/report/queryFlatContract', params);
  return res.body || [];
}
