import { request } from '@/utils';

import { ExpectationScript } from './queryExpectation';

export async function updateExpectation(params: ExpectationScript) {
  const res = await request.post('/report/config/expectation/save', params);
  return res.body;
}
