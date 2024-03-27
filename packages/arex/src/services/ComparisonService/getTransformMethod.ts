import { request } from '@/utils';

export async function getTransformMethod(appId: string) {
  const res = await request.get<string[]>(
    '/webApi/config/comparison/transform/getTransformMethod?appId=' + appId,
  );
  return res.body;
}
