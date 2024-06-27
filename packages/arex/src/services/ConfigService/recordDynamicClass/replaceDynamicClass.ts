import { DynamicClass } from '@/services/ConfigService';
import { request } from '@/utils';

export async function replaceDynamicClass(
  appId: string,
  dynamicClasses: Omit<DynamicClass, 'id'>[],
) {
  const res = await request.post<boolean>(
    '/webApi/config/dynamicClass/replace/' + appId,
    dynamicClasses,
  );
  return res.body;
}
