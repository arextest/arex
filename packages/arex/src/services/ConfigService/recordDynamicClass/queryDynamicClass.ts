import { request } from '@/utils';

export type QueryRecordDynamicClassReq = {
  appId: string;
};

export type DynamicClass = {
  modifiedTime?: string;
  id: string;
  appId?: string;
  fullClassName: string;
  methodName?: string;
  parameterTypes?: string;
  configType?: number;
};
export type QueryRecordDynamicClassRes = DynamicClass[] | null;

export async function queryDynamicClass(params: QueryRecordDynamicClassReq) {
  const res = await request.get<QueryRecordDynamicClassRes | undefined>(
    '/report/config/dynamicClass/useResultAsList/appId/' + params.appId,
  );
  return res.body;
}
