import { request } from '@/utils';

export interface InsertDynamicClassRes {
  appId: string;
  fullClassName: string;
  methodName?: string;
  parameterTypes?: string | null;
  configType: number;
}
export async function insertDynamicClass(params: InsertDynamicClassRes) {
  const res = await request.post<boolean>('/report/config/dynamicClass/modify/INSERT', params);
  return res.body;
}
