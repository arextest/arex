import { request } from '@/utils';

export enum AppVisibilityLevel {
  PUBLIC,
  PRIVATE,
}

export interface CreateAppReq {
  appName: string;
  owners: string[];
  visibilityLevel: AppVisibilityLevel;
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
