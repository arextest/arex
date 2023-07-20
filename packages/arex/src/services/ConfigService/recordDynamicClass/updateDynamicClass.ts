import { request } from '@/utils';

export type UpdateSettingReqInsert = {
  id: string;
  appId: string;
  fullClassName: string;
  methodName?: string;
  parameterTypes?: string | null;
};

export async function updateDynamicClass(params: UpdateSettingReqInsert) {
  const res = await request.post<boolean>('/report/config/dynamicClass/modify/UPDATE', params);
  return res.body;
}
