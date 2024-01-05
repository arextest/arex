import { ReportAxios } from './index';

export async function queryReplayMaxQps(params: { appId: string }) {
  const res = await ReportAxios.get<{
    body: {
      appId: string;
      sendMaxQps: number;
    };
  }>('/webApi/config/schedule/useResult/appId/' + params.appId);
  return res.data.body.sendMaxQps;
}
