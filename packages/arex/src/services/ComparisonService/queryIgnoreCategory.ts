import { IgnoreCategory } from '@/services/ComparisonService/insertIgnoreCategory';
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
  ignoreCategoryDetail: IgnoreCategory;
  modifiedTime: number;
  operationId: string | null;
  operationName: string | null;
  operationType: string | null;
  status: string | null;
};
export async function queryIgnoreCategory(params: QueryNodeReq<'Interface'>) {
  const res = await request.post<IgnoreCategoryData[]>(
    '/webApi/config/comparison/ignoreCategory/queryComparisonConfig',
    params,
  );
  return res.body;
}
