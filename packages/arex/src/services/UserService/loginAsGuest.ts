import { request } from '../../utils';

export interface LoginAsGuestReq {
  userName?: string; // 尝试读取 localstorage中的 email 值，用于恢复上一次访客登陆状态
}

export interface LoginAsGuestRes {
  userName: string;
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

export function loginAsGuest(params: LoginAsGuestReq) {
  return request
    .post<LoginAsGuestRes>(`/report/login/loginAsGuest`, params)
    .then((res) => res.body);
}
