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
  | 'appId'
>;

export const DEFAULT_MULTI_ENV_CONFIG = {
  recordMachineCountLimit: 1,
  allowDayOfWeeks: 127,
  sampleRate: 1,
  allowTimeOfDayFrom: '00:01',
  allowTimeOfDayTo: '23:59',
};

export async function updateMultiEnvCollectSetting(params: UpdateMultiEnvCollectSettingReq) {
  const res = await request.post<boolean>(
    '/webApi/config/serviceCollect/modify/UPDATE_MULTI_ENV',
    params,
  );
  return res.body;
}
