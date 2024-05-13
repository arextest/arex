import { request } from '@/utils';

export interface UpdateEncryptionNodeReq {
  id: string;
  path?: string[];
  methodName?: string;
}

export async function updateEncryptionNode(params: UpdateEncryptionNodeReq) {
  const res = await request.post<boolean>(
    '/webApi/config/comparison/encryption/modify/UPDATE',
    params,
  );
  return res.body;
}
