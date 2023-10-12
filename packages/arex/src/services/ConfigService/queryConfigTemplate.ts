import { request } from '@/utils';

export async function queryConfigTemplate(params: { appId: string }) {
  const res = await request.post<{
    configTemplate: string;
  }>('/report/config/yamlTemplate/queryConfigTemplate', params);
  return res.body;
}
