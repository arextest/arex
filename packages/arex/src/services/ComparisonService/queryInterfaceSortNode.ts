import { QueryInterfaceIgnoreNodeReq } from '@/services/ComparisonService/queryInterfaceIgnoreNode';
import { SortNode } from '@/services/ComparisonService/querySortNode';
import { request } from '@/utils';

export async function queryInterfaceSortNode(params: QueryInterfaceIgnoreNodeReq) {
  const res = await request.get<SortNode[]>(
    '/report/config/comparison/listsort/queryByInterfaceIdAndOperationId',
    params,
  );
  return res.body
    .map<SortNode>((item) => ({
      ...item,
      path: item.listPath.concat(['']).join('/'),
      pathKeyList: item.keys.map((key) => key.concat(['']).join('/')),
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
}
