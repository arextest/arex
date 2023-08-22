import { request } from '@/utils';

export function getOauthClientId() {
  return request
    .get<{ clientId: string }>(`/report/login/oauthClientId/GitlabOauth`, undefined, {
      headers: { 'access-token': 'no' },
    })
    .then((res) => res.body);
}
