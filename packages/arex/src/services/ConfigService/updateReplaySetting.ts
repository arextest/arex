import { ExcludeOperationMap } from '@/services/ConfigService/queryReplaySetting';
import { request } from '@/utils';

export type UpdateReplaySettingReq = {
  appId: string;
  sendMaxQps?: number;
  excludeOperationMap?: ExcludeOperationMap;
};

export async function updateReplaySetting(params: UpdateReplaySettingReq) {
  const res = await request.post<boolean>('/webApi/config/schedule/modify/UPDATE', params);
  return res.body;
}
