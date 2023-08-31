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
  const res = await request.post<IgnoreCategoryData[]>( // TODO
    '/report/config/comparison/ignoreCategory/queryComparisonConfig',
    params,
  );
  return res.body[res.body.length - 1];
}
