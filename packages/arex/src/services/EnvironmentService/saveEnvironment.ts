import { Environment } from '@/services/EnvironmentService/getEnvironments';
import { request } from '@/utils';

export type SaveEnvironmentReq = {
  env: Omit<Environment, 'id'> & { id?: string };
};

export type SaveEnvironmentRes = {
  success: boolean;
  environmentId: string;
};

export default async function saveEnvironment(params: SaveEnvironmentReq) {
  return request
    .post<SaveEnvironmentRes>(`/report/environment/saveEnvironment`, params)
    .then((res) => res.body);
}
