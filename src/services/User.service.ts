import request from '../helpers/api/axios';
import { tryParseJsonString } from '../helpers/utils';
import { State as UserProfile } from '../store/useUserProfile';
import { FavoriteAppReq, LoginAsGuestReq, LoginAsGuestRes, UserFavoriteAppRes } from './User.type';

export class UserService {
  static async getUserProfile(email: string) {
    const res = await request.get<{ profile: string }>(`/report/login/userProfile/${email}`);
    return tryParseJsonString<UserProfile>(res.body.profile);
  }

  static updateUserProfile(params: UserProfile) {
    return request.post(`/report/login/updateUserProfile`, params);
  }

  static async loginAsGuest(params: LoginAsGuestReq) {
    const res = await request.post<LoginAsGuestRes>(`/report/login/loginAsGuest`, params);
    return res.body;
  }

  static async getFavoriteApp(email: string) {
    const res = await request.get<UserFavoriteAppRes>(`/report/login/userFavoriteApp/${email}`);
    return res.body.favoriteApps ?? [];
  }

  static async favoriteApp(params: FavoriteAppReq) {
    const res = await request.post<boolean>(`/report/login/userFavoriteApp/modify/INSERT`, params);
    return res.body;
  }

  static async unFavoriteApp(params: FavoriteAppReq) {
    const res = await request.post<boolean>(`/report/login/userFavoriteApp/modify/REMOVE`, params);
    return res.body;
  }
}
