import { request } from '@/utils';

import { ExpectationScript } from './queryExpectation';

export async function updateExpectation(params: ExpectationScript) {
  const res = await request.post('/webApi/expectation/save', params);
  return res.body;
}
