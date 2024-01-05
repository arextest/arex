import { request } from '@/utils';

export async function deleteEncryptionNode(params: { id: string }) {
  const res = await request.post<boolean>(
    '/webApi/config/comparison/encryption/modify/REMOVE',
    params,
  );
  return res.body;
}
