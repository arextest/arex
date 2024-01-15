import { request } from '@/utils';

export interface UpdateAgentReq {
  appId: string;
  host: string;
  extendField: Record<string, string>;
}

export async function updateAgent(params: UpdateAgentReq) {
  const res = await request.post<boolean>(
    `/webApi/config/applicationInstances/modify/UPDATE`,
    params,
  );
  return res.body;
}
