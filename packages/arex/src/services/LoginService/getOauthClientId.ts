import { request } from '@/utils';

export function getOauthClientId() {
  return request
    .get<{ clientId: string; redirectUri: string }>(
      `/report/login/oauthInfo/GitlabOauth`,
      undefined,
      {
        headers: { 'access-token': 'no' },
      },
    )
    .then((res) => res.body);
}
