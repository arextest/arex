import { request } from '../../utils';

export type DeleteEnvironmentReq = {
  id: string;
  workspaceId: string;
};

export default async function deleteEnvironment(params: DeleteEnvironmentReq) {
  return request
    .post<{ success: boolean }>(`/report/environment/removeEnvironment`, params)
    .then((res) => res.body.success);
}
