import { request } from '@/utils';

export async function deleteEncryptionNode(params: { id: string }) {
  const res = await request.post<boolean>(
    '/report/config/comparison/encryption/modify/REMOVE',
    params,
  );
  return res.body;
}
