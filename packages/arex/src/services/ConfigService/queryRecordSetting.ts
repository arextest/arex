import { request } from '@/utils';
import { MultiEnvironmentConfig } from '@/services/ConfigService/updateMultiEnvCollectSetting';

export interface QueryRecordSettingReq {
  appId: string;
}

export type SerializeSkipInfo = {
  fieldName: string;
  fullClassName: string;
};

export type ServiceCollectConfig = {
  allowDayOfWeeks: number;
  allowTimeOfDayFrom: string;
  allowTimeOfDayTo: string;
  appId: string;
  modifiedTime: string;
  sampleRate: number;
  excludeServiceOperationSet: string[];
  recordMachineCountLimit?: number;
  serializeSkipInfoList?: SerializeSkipInfo[] | null;
  extendField?: { includeServiceOperations?: string } | null;
  multiEnvConfigs?: MultiEnvironmentConfig[];
  envTags?: Record<string, string[]>;
};

export async function queryRecordSetting(params: QueryRecordSettingReq) {
  const res = await request.get<ServiceCollectConfig>(
    '/webApi/config/serviceCollect/useResult/appId/' + params.appId,
  );
  return res.body;
}
