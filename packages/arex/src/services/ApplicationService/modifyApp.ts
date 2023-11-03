import { request } from '@/utils';

import { CreateAppReq } from './createApp';

export interface ModifyAppReq extends Partial<CreateAppReq> {
  appId: string;
}

export async function modifyApp(params: ModifyAppReq) {
  const res = await request.post<boolean>('/storage/config/app/modify', params);
  return res.body;
}
