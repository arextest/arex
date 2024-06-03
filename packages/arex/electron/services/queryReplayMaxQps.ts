import { AxiosRequestConfig } from 'axios';

import { ReportAxios } from './index';

export async function queryReplayMaxQps(params: { appId: string }, config?: AxiosRequestConfig) {
  const res = await ReportAxios.get<{
    body: {
      appId: string;
      sendMaxQps: number;
    };
  }>('/webApi/config/schedule/useResult/appId/' + params.appId, config);
  return res.data.body.sendMaxQps;
}
