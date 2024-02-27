import { DynamicClass } from '@/services/ConfigService';
import { request } from '@/utils';

export async function insertDynamicClass(params: Omit<DynamicClass, 'id'>) {
  const res = await request.post<boolean>('/webApi/config/dynamicClass/modify/INSERT', params);
  return res.body;
}
