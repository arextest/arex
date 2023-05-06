import { request } from '@/utils';

import { Environment } from '../../store/useEnvironments';

export type GetEnvironmentReq = {
  workspaceId: string;
};

export type GetEnvironmentRes = {
  environments: Environment[];
};

export default async function getEnvironments(params: GetEnvironmentReq) {
  return request
    .post<GetEnvironmentRes>(`/report/environment/queryEnvsByWorkspace`, params)
    .then((res) => Promise.resolve(res.body.environments));
}
