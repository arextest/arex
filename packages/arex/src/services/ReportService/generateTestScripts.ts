import { GenReq, GenRes } from "@arextest/arex-request/src/types/ArexAITypes";

import { request } from '@/utils';

export async function generateTestScripts(params: GenReq) {
  return request
    .post<GenRes>('/webApi/ai/generateTestScript', params)
    .then((res) => Promise.resolve(res.body));
}
