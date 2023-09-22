import { Environment } from '@/services/EnvironmentService/getEnvironments';
import { request } from '@/utils';

export type SaveEnvironmentReq = {
  env: Omit<Environment, 'id'> & { id?: string };
};

export default async function saveEnvironment(params: SaveEnvironmentReq) {
  return request
    .post<{
      success: boolean;
      // TODO id
    }>(`/report/environment/saveEnvironment`, params)
    .then((res) => res.body.success);
}
