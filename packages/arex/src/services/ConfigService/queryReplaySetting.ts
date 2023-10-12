import { request } from '@/utils';

export type ExcludeOperationMap = { [key: string]: string[] };

export type QueryReplaySettingRes = {
  status: number | null;
  modifiedTime: number;
  appId: string;
  excludeOperationMap: ExcludeOperationMap;
  offsetDays: number;
  targetEnv: string[];
  sendMaxQps: number;
};

export async function queryReplaySetting(params: { id: string }) {
  const res = await request.get<QueryReplaySettingRes>(
    '/report/config/schedule/useResult/appId/' + params.id,
    undefined,
    {
      headers: { 'App-Id': params.id },
    },
  );
  return res.body;
}
