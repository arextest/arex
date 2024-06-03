import { AxiosRequestConfig } from 'axios';

import { ScheduleAxios } from './index';
import { SendStatusType } from './type';

export interface PostSendReq {
  caseId: string;
  planId: string;
  replayId?: string;
  errorMsg: string;
  sendStatusType: SendStatusType;
}

export async function postSend(params: PostSendReq, config?: AxiosRequestConfig) {
  const res = await ScheduleAxios.post('/schedule/replay/local/postSend', params, config);
  return res.data;
}
