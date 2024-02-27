import { request } from '@/utils';

import { SystemConfig } from './getSystemConfig';

export async function saveSystemConfig(params: { systemConfig: Partial<SystemConfig> }) {
  const res = await request.post<boolean>(`/webApi/system/config/save`, params);
  return res.body;
}
