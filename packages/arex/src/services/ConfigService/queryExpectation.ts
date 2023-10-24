import { request } from '@/utils';

export interface QueryExpectationReq {
  /**
   * app id
   */
  appId?: string;
  /**
   * Script title, eg: classA.methodB
   */
  title?: string;
  /**
   * Script content
   */
  content: string;
  /**
   * Script is valid
   */
  valid?: boolean;
  /**
   * Script expiration time
   */
  expirationTime?: number;
  /**
   * 0 specified: for specified operation
   * 1 global: for all operation
   */
  scope?: 0 | 1;
}

export async function queryExpectation(params: QueryExpectationReq) {
  const res = await request.post('/report/config/expectation/query', params);
  return res.body;
}
