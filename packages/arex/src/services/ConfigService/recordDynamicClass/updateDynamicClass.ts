import { DynamicClass } from '@/services/ConfigService';
import { request } from '@/utils';

export async function updateDynamicClass(params: DynamicClass) {
  const res = await request.post<boolean>('/report/config/dynamicClass/modify/UPDATE', params);
  return res.body;
}
