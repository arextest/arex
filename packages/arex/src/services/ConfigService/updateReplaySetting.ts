import { ExcludeOperationMap } from '@/services/ConfigService/queryReplaySetting';
import { request } from '@/utils';

export type UpdateReplaySettingReq = {
  appId: string;
  offsetDays?: number;
  excludeOperationMap?: ExcludeOperationMap;
};

export async function updateReplaySetting(params: UpdateReplaySettingReq) {
  const res = await request.post<boolean>('/report/config/schedule/modify/UPDATE', params);
  return res.body;
}
