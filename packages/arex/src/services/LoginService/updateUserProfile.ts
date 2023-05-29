import { request } from '@/utils';

export type UpdateUserProfileReq = {
  profile: string; // JSON.stringify(UserProfile)
  userName: string;
};
export async function updateUserProfile(params: UpdateUserProfileReq) {
  return request.post<{ success: boolean }>(`/report/login/updateUserProfile`, params);
}
