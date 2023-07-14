import { OperationId } from '@/services/ApplicationService';
import { QueryNodeReq } from '@/services/ComparisonService/queryIgnoreNode';
import { request } from '@/utils';

export type SortNodePathKey = {
  listPath: string[];
  keys: string[][];
};

export interface SortNodeBase extends SortNodePathKey {
  appId?: string;
  operationId?: OperationId<'Interface'>;
  // 为 dependency 添加忽略项的两种方式
  // 1. 当 dependencyId 存在时传 dependencyId
  dependencyId: OperationId<'Global'>;
  // 2. 当 dependencyId 不存在时，传 categoryName 和 operationName
  categoryName?: string;
  operationName?: string;
  // collection attr
  fsInterfaceId?: string;
  compareConfigType?: string;
}

export interface SortNode extends SortNodeBase {
  id: string;
  modifiedTime: number;
  status: number | null;
  expirationType: number;
  expirationDate: number;
  path: string;
  pathKeyList: string[];
}

export async function querySortNode(params: QueryNodeReq<'Interface'>) {
  const res = await request.post<SortNode[]>(
    '/report/config/comparison/listsort/queryComparisonConfig',
    {
      ...params,
      operationId: params.operationId || undefined,
    },
  );
  return res.body
    .map<SortNode>((item) => ({
      ...item,
      path: item.listPath.concat(['']).join('/'),
      pathKeyList: item.keys.map((key) => key.concat(['']).join('/')),
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
}
