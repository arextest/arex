import { request } from '@/utils';

export interface QueryRecordSettingReq {
  appId: string;
}

export type SerializeSkipInfo = {
  fieldName: string;
  fullClassName: string;
};

export interface QueryRecordSettingRes {
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
}

export async function queryRecordSetting(params: QueryRecordSettingReq) {
  const res = await request.get<QueryRecordSettingRes>(
    '/webApi/config/serviceCollect/useResult/appId/' + params.appId,
  );
  return res.body;
}
