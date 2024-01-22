import { ServiceCollectConfig } from '@/services/ConfigService/queryRecordSetting';
import { request } from '@/utils';

export type UpdateMultiEnvCollectSettingReq = Pick<
  ServiceCollectConfig,
  'appId' | 'multiEnvConfigs'
>;

export type MultiEnvironmentConfig = Pick<
  ServiceCollectConfig,
  | 'recordMachineCountLimit'
  | 'allowDayOfWeeks'
  | 'sampleRate'
  | 'allowTimeOfDayFrom'
  | 'allowTimeOfDayTo'
  | 'envTags'
>;

export async function updateMultiEnvCollectSetting(params: UpdateMultiEnvCollectSettingReq) {
  const res = await request.post<boolean>('/webApi/config/serviceCollect/modify/UPDATE_MULTI_ENV', params);
  return res.body;
}
