import { request } from '@/utils';

export type ExcludeOperationMap = { [key: string]: string[] };

export type QueryReplaySettingRes = {
  status: number | null;
  modifiedTime: number;
  appId: string;
  excludeOperationMap: ExcludeOperationMap;
  mockHandlerJarUrl: string | null;
  offsetDays: number;
  targetEnv: string[];
  sendMaxQps: number;
};

export async function queryReplaySetting(params: { appId: string }) {
  const res = await request.get<QueryReplaySettingRes>(
    '/webApi/config/schedule/useResult/appId/' + params.appId,
  );
  return res.body;
}
