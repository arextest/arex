import { request } from '@/utils';

export interface RemoveDynamicClassSettingReq {
  appId: string;
  id: string;
}

export async function removeDynamicClass(params: RemoveDynamicClassSettingReq) {
  const res = await request.post<boolean>('/report/config/dynamicClass/modify/REMOVE', params, {
    headers: { 'App-Id': params.appId },
  });
  return res.body;
}
