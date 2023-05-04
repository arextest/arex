import { request } from '../../utils';

export type DuplicateEnvironmentReq = {
  id: string;
  workspaceId: string;
};

export default async function duplicateEnvironment(params: DuplicateEnvironmentReq) {
  return request
    .post<{ success: boolean }>(`/report/environment/duplicateEnvironment`, params)
    .then((res) => res.body.success);
}
