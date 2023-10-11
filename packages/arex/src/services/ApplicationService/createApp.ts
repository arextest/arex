import { request } from '@/utils';

export interface CreateAppReq {
  appName: string;
  owners: string[];
}

export interface CreateAppRes {
  appId: string;
  msg: string | null;
  success: boolean;
}

export async function createApp(params: CreateAppReq) {
  const res = await request.post<CreateAppRes>('/storage/config/app/add', params);
  return res.body;
}
