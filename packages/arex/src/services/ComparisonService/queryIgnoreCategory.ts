import { QueryNodeReq } from '@/services/ComparisonService/queryIgnoreNode';
import { request } from '@/utils';

export async function queryIgnoreCategory(params: QueryNodeReq<'Interface'>) {
  return request.post('/report/config/comparison/ignoreCategory/queryComparisonConfig', params);
}
