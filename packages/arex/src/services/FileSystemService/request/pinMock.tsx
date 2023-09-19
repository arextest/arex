// import { ArexRESTRequest } from '@arextest/arex-request/dist/components/http/data/rest';

import { request } from '@/utils';

export async function pinMock(params: any) {
  const res = await request.post<{ success: boolean }>(`/report/filesystem/pinMock`, params);
  return res.body.success;
}
