import { request } from '@/utils';

export async function deleteTransformNode(id: string) {
  const res = await request.post<boolean>('/webApi/config/comparison/transform/modify/REMOVE', {
    id,
  });
  return res.body;
}
