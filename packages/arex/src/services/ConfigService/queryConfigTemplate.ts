import { request } from '@/utils';

export async function queryConfigTemplate(params: { appId: string }) {
  const res = await request.post<{
    configTemplate: string;
  }>('/report/config/yamlTemplate/queryConfigTemplate', params, {
    headers: { 'App-Id': params.appId },
  });
  return res.body;
}
