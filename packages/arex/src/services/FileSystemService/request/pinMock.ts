import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

export interface PinMockReq {
  workspaceId: string;
  infoId?: string;
  recordId: string;
  nodeType: CollectionNodeType;
}

export async function pinMock(params: PinMockReq) {
  const res = await request.post<{ success: boolean }>(`/webApi/filesystem/pinMock`, params);
  return res.body.success;
}
