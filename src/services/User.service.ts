import request from "../helpers/api/axios";
import { tryParseJsonString } from "../helpers/utils";
import { State as UserProfile } from "../store/useUserProfile";

export class UserService {
  static async getUserProfile(email: string) {
    const res = await request.get<{ profile: string }>(
      `/api/login/userProfile/${email}`
    );
    return tryParseJsonString<UserProfile>(res.body.profile);
  }

  static updateUserProfile(params: UserProfile) {
    return request.post(`/api/login/updateUserProfile`, params);
  }
  static loginAsGuest(params) {
    return request.post(`/api/login/loginAsGuest`, params);
  }
}
