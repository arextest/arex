import { request } from '@/utils';

export type loginVerifyReq = {
  userName: string;
  verificationCode: string;
};

export type loginVerifyRes = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export function loginVerify(params: loginVerifyReq) {
  return request.post<loginVerifyRes>(`/report/login/verify`, params).then((res) => res.body);
}
