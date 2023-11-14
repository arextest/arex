import { DynamicClass } from '@/services/ConfigService';
import { request } from '@/utils';

export async function insertDynamicClass(params: DynamicClass) {
  const res = await request.post<boolean>('/report/config/dynamicClass/modify/INSERT', params);
  return res.body;
}
