import { request } from '@/utils';

export interface ValidInvitationReq {
  token: string;
  userName: string;
  workspaceId: string;
}

export interface ValidInvitationRes {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

export async function validInvitation(params: ValidInvitationReq) {
  return request.post<ValidInvitationRes>(`/webApi/filesystem/validInvitation`, params);
}
