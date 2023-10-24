import { request } from '@/utils';

export interface ExpectationScript {
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
  content?: string;
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
  dataChangeCreateBy?: string;
  dataChangeUpdateBy?: string;
}

export async function queryExpectation(params: { appId: string }) {
  const res = await request.post<ExpectationScript[]>('/report/config/expectation/query', params);
  return res.body;
}
