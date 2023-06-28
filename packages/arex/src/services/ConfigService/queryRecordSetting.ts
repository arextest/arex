import { request } from '@/utils';

export interface QueryRecordSettingReq {
  id: string;
}

export interface QueryRecordSettingRes {
  allowDayOfWeeks: number;
  allowTimeOfDayFrom: string;
  allowTimeOfDayTo: string;
  appId: string;
  modifiedTime: string;
  sampleRate: number;
  timeMock: boolean;
  excludeServiceOperationSet: string[];
  recordMachineCountLimit?: number;
  extendField?: { includeServiceOperations: string } | null;
}

export async function queryRecordSetting(params: QueryRecordSettingReq) {
  const res = await request.get<QueryRecordSettingRes>(
    '/report/config/serviceCollect/useResult/appId/' + params.id,
  );
  return res.body;
}
