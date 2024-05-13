import { request } from '@/utils';

export interface UpdateConfigTemplateReq {
  appId: string;
  configTemplate?: string;
}

export async function updateConfigTemplate(params: UpdateConfigTemplateReq) {
  const res = await request.post<boolean>('/webApi/config/yamlTemplate/pushConfigTemplate', params);
  return res.body;
}
