import { ScheduleAxios } from './index';
import { SendStatusType } from './type';

export interface PostSendReq {
  caseId: string;
  planId: string;
  replayId?: string;
  errorMsg: string;
  sendStatusType: SendStatusType;
}

export default async function postSend(params: PostSendReq) {
  const res = await ScheduleAxios.post('/schedule/replay/local/postSend', params);
  return res.data;
}
