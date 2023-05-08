import { request } from '@/utils';

export async function inviteToWorkspace(params: any) {
  return request.post(`/report/filesystem/inviteToWorkspace`, params);
}
