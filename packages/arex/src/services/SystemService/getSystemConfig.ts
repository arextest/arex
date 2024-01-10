import { request } from '@/utils';

import { SystemConfig } from './saveSystemConfig';

export async function getSystemConfig() {
  const res = await request.get<SystemConfig>(`/webApi/system/config/list`);
  return res.body;
}
