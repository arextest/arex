import { request } from '@/utils';

export function sendVerifyCodeByEmail(email: string) {
  return request
    .get<{ success: boolean }>(`/report/login/getVerificationCode/${email}`, undefined, {
      headers: { 'access-token': 'no' },
    })
    .then((res) => res.body.success);
}
