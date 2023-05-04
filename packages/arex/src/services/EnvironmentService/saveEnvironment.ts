import { Environment } from '../../store/useEnvironments';
import { request } from '../../utils';

export type SaveEnvironmentReq = {
  env: Omit<Environment, 'id'> & { id?: string };
};

export default async function saveEnvironment(params: SaveEnvironmentReq) {
  return request
    .post<{ success: boolean }>(`/report/environment/saveEnvironment`, params)
    .then((res) => res.body.success);
}
