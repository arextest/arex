import { request } from '@/utils';

export interface RemoveDynamicClassSettingReq {
  appId: string;
  id: string;
}

/**
 * @deprecated use replaceDynamicClass for batch update
 * @param params
 */
export async function removeDynamicClass(params: RemoveDynamicClassSettingReq) {
  const res = await request.post<boolean>('/webApi/config/dynamicClass/modify/REMOVE', params);
  return res.body;
}
