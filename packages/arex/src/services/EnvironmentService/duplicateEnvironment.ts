import { request } from '@/utils';

import { Environment } from './getEnvironments';

export type DuplicateEnvironmentReq = {
  id: string;
  workspaceId: string;
};

export type DuplicateEnvironmentRes = { environments: Environment[] | null };

export default async function duplicateEnvironment(params: DuplicateEnvironmentReq) {
  return request
    .post<DuplicateEnvironmentRes>(`/report/environment/duplicateEnvironment`, params)
    .then((res) => res.body.environments);
}
