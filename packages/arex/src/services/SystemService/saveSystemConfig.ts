import { request } from '@/utils';

export interface SystemConfig {
  operator: string;
  callbackUrl: string;
}

export async function saveSystemConfig(params: { systemConfig: SystemConfig }) {
  const res = await request.post<boolean>(`/webApi/system/config/save`, params);
  return res.body;
}
