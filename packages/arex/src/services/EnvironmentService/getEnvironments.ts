import { ArexEnvironment } from '@arextest/arex-request/src';

import { request } from '@/utils';

export type GetEnvironmentReq = {
  workspaceId: string;
};

export type EnvironmentKeyValues = { key: string; value: string; active?: boolean };

export type Environment = {
  envName: string;
  id: string;
  keyValues?: EnvironmentKeyValues[];
  workspaceId?: string;
};

export type GetEnvironmentRes = {
  environments: Environment[];
};

export default async function getEnvironments(params: GetEnvironmentReq) {
  return request
    .post<GetEnvironmentRes>(`/report/environment/queryEnvsByWorkspace`, params)
    .then((res) =>
      Promise.resolve<ArexEnvironment[]>(
        res.body.environments.map((env) => ({
          id: env.id,
          name: env.envName,
          variables: env.keyValues,
        })),
      ),
    );
}
