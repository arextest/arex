import { DynamicClass } from '@/services/ConfigService';
import { request } from '@/utils';

/**
 * @deprecated use replaceDynamicClass for batch update
 * @param params
 */
export async function updateDynamicClass(params: DynamicClass) {
  const res = await request.post<boolean>('/webApi/config/dynamicClass/modify/UPDATE', params);
  return res.body;
}
