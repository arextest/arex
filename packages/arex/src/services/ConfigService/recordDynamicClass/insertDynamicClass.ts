import { request } from '@/utils';

export interface InsertDynamicClassReq {
  appId: string;
  fullClassName: string;
  methodName?: string;
  parameterTypes?: string | null;
  configType: number;
}
export async function insertDynamicClass(params: InsertDynamicClassReq) {
  const res = await request.post<boolean>('/report/config/dynamicClass/modify/INSERT', params);
  return res.body;
}
