import { request } from '@/utils';

export interface UpdateRecordSettingReq {
  appId: string;
  sampleRate: number;
  allowDayOfWeeks: number;
  allowTimeOfDayFrom: string;
  allowTimeOfDayTo: string;
  includeOperationSet?: string[];
  excludeOperationSet?: string[];
  excludeDependentOperationSet?: string[];
  includeServiceSet?: string[];
  excludeServiceOperationSet?: string[];
  recordMachineCountLimit?: number;
}

export async function updateRecordSetting(params: UpdateRecordSettingReq) {
  const res = await request.post<boolean>('/report/config/serviceCollect/modify/UPDATE', params, {
    headers: { 'App-Id': params.appId },
  });
  return res.body;
}
