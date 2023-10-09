import { request } from '@/utils';

export interface CreateAppReq {
  appName: string;
  owners: string[];
}

export async function createApp(params: CreateAppReq) {
  const res = await request.post<boolean>('/storage/config/app/add', params);
  return res.body;
}
