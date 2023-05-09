// import { RequestMethod } from 'arex-core';
// import { HoppRESTRequest } from 'arex-request-core/dist/components/http/data/rest';

import { request } from '@/utils';

export async function renameRequest(params:any) {
  return request.post(`/report/filesystem/rename`, params);
}
