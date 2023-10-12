import { request } from '@/utils';

import { ApplicationDataType } from './getAppList';

export async function getAppInfo(appId: string) {
  const res = await request.get<ApplicationDataType>(
    '/report/config/application/useResult/appId/' + appId,
    undefined,
    {
      headers: { 'App-Id': appId },
    },
  );
  return res.body;
}
