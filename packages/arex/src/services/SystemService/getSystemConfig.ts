import { request } from '@/utils';

export interface SystemConfig {
  desensitizationJar: {
    jarUrl?: string;
    remark?: null;
  } | null;
  callbackUrl: string;
  // The following is not currently in use
  refreshTaskMark: {
    transferSystemConfig: number;
    cleanConfigComparisonIgnoreCategory: number;
    missingComparisonIgnoreCategory: number;
    missingRecordConfig: number;
  };
  compareIgnoreTimePrecisionMillis: number;
  compareNameToLower: boolean;
  compareNullEqualsEmpty: boolean;
  ignoreNodeSet: boolean;
  selectIgnoreCompare: boolean;
  onlyCompareCoincidentColumn: boolean;
  uuidIgnore: boolean;
  ipIgnore: boolean;
}

export async function getSystemConfig() {
  const res = await request.get<SystemConfig>(`/webApi/system/config/list`);
  return res.body;
}
