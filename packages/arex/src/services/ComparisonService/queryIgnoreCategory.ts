import { QueryNodeReq } from '@/services/ComparisonService/queryIgnoreNode';
import { request } from '@/utils';

export type IgnoreCategoryData = {
  appId: string;
  compareConfigType: number;
  dependencyId: string | null;
  expirationDate: number;
  expirationType: number;
  fsInterfaceId: string | null;
  id: string;
  ignoreCategory: string[];
  modifiedTime: number;
  operationId: string | null;
  operationName: string | null;
  operationType: string | null;
  status: string | null;
};
export async function queryIgnoreCategory(params: QueryNodeReq<'Interface'>) {
  const res = await request.post<IgnoreCategoryData[]>(
    '/report/config/comparison/ignoreCategory/queryComparisonConfig',
    params,
  );
  /**
   * For consistency design reasons,
   * the valid information of the interface is placed in an array,
   * and the length of the array is guaranteed to be
   * only 1 or 0 by reasonable calls to the interface.
   */
  return res.body?.[0];
}
