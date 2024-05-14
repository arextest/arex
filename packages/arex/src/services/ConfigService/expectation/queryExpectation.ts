import { request } from '@/utils';

export interface ExpectationScript {
  id?: string;
  /**
   * app id
   */
  appId?: string;
  /**
   * operation id
   */
  operationId?: string;
  /**
   * Script alias
   */
  alias?: string;
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
  dataChangeCreateTime?: number;
  dataChangeUpdateBy?: string;
  dataChangeUpdateTime?: number;
}

export async function queryExpectation(params: { appId: string }) {
  const res = await request.post<ExpectationScript[]>('/webApi/expectation/query', params);
  return res.body;
}
