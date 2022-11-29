import request from '../helpers/api/axios';
import { tryParseJsonString } from '../helpers/utils';
import { State as UserProfile } from '../store/useUserProfile';
import { LoginAsGuestRes } from './UserService.type';

export class UserService {
  static async getUserProfile(email: string) {
    const res = await request.get<{ profile: string }>(`/api/login/userProfile/${email}`);
    return tryParseJsonString<UserProfile>(res.body.profile);
  }

  static updateUserProfile(params: UserProfile) {
    return request.post(`/api/login/updateUserProfile`, params);
  }
  static async loginAsGuest() {
    const res = await request.post<LoginAsGuestRes>(`/api/login/loginAsGuest`);
    return res.body;
  }
}
