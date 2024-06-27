import { request } from '@/utils';

export async function deleteTransformRootNode(id: string) {
  const res = await request.post<boolean>('/webApi/config/comparison/rootTransform/modify/REMOVE', {
    id,
  });

  return res.body;
}
