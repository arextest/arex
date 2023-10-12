import { request } from '@/utils';

export interface ModifyAppReq {
  appId: string;
  appName?: string;
  owners?: string[];
}

export async function modifyApp(params: ModifyAppReq) {
  const res = await request.post<boolean>('/storage/config/app/modify', params, {
    headers: { 'App-Id': params.appId },
  });
  return res.body;
}
