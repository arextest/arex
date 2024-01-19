import { request } from '@/utils';

export function sendVerifyCodeByEmail(email: string) {
  return request
    // http://10.144.62.53:8090/api/login/getVerificationCode/123
    .get<{ success: boolean }>(`/webApi/login/getVerificationCode/${email}`, undefined, {
      headers: { 'access-token': 'no' },
    })
    .then((res) => res.body.success);
}
