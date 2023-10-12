import { request } from '@/utils';

export interface AgentData {
  status: number | null;
  modifiedTime: number;
  id: string;
  appId: string;
  recordVersion: string | null;
  host: string;
  dataUpdateTime: number;
}

export async function getAgentList(appId: string) {
  const res = await request.get<AgentData[]>(
    '/report/config/applicationInstances/useResultAsList/appId/' + appId,
    undefined,
    {
      headers: { 'App-Id': appId },
    },
  );
  return res.body;
}
