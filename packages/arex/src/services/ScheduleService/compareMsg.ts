import { DiffLog } from '@/services/ReportService';
import { LogEntity } from '@/services/ScheduleService/queryLogEntity';
import { request } from '@/utils';

export interface CompareMsgReq {
  baseMsg: string;
  testMsg: string;
  appId: string;
  operationName: string;
}

export interface CompareMsgRes {
  logInfos: (DiffLog & { logEntity: LogEntity })[];
  baseMsg: string;
  testMsg: string;
  diffResultCode: number;
  exceptionMsg?: string;
}

export async function compareMsg(params: CompareMsgReq) {
  const res = await request.post<CompareMsgRes>(`/schedule/collection/compareMsg`, params);
  return res.body;
}
