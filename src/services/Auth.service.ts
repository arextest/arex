import axios from 'axios';

import { RefreshTokenKey } from '../constant';
import { getLocalStorage } from '../helpers/utils';

export class AuthService {
  static sendVerifyCodeByEmail(email: string) {
    return axios.get(`/report/login/getVerificationCode/${email}`, {
      headers: { 'access-token': 'no' },
    });
  }
  static loginVerify(params: { userName: string; verificationCode: string }) {
    return axios.post(`/report/login/verify`, params);
  }
  static refreshToken(params: { userName: string }) {
    return axios.get(`/report/login/refresh/${params.userName}`, {
      // @ts-ignore
      headers: { 'refresh-token': getLocalStorage<string>(RefreshTokenKey) },
    });
  }
}
