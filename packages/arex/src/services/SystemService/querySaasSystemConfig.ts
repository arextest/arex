import { request } from '@/utils';

interface QuerySaasSystemConfigRes {
  saas_api_tenant_token: string;
}

export async function querySaasSystemConfig() {
  const res = await request.get<QuerySaasSystemConfigRes>('/webApi/saas/system/queryConfig');
  return res.body;
}
