import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { ScheduleAxios } from './index';

export interface PreSendReq {
  planId: string;
  caseId: string;
  recordId: string;
  replayPlanType: number; // TODO enum
}

export interface PreSendRes {
  result: number;
  desc: string;
  data: boolean;
}

export async function preSend(params: PreSendReq, config?: AxiosRequestConfig) {
  const res = await ScheduleAxios.post<PreSendReq, AxiosResponse<PreSendRes>>(
    '/schedule/replay/local/preSend',
    params,
    config,
  );
  return res.data;
}
