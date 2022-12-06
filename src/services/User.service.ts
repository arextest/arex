import request from '../helpers/api/axios';
import { tryParseJsonString } from '../helpers/utils';
import { State as UserProfile } from '../store/useUserProfile';
import { LoginAsGuestReq, LoginAsGuestRes } from './UserService.type';

export class UserService {
  static async getUserProfile(email: string) {
    const res = await request.get<{ profile: string }>(`/api/login/userProfile/${email}`);
    return tryParseJsonString<UserProfile>(res.body.profile);
  }

  static updateUserProfile(params: UserProfile) {
    return request.post(`/api/login/updateUserProfile`, params);
  }
  static async loginAsGuest(params: LoginAsGuestReq) {
    const res = await request.post<LoginAsGuestRes>(`/api/login/loginAsGuest`, params);
    return res.body;
  }
}
