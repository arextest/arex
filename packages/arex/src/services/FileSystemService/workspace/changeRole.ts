import { RoleEnum } from 'arex-core';

import { request } from '@/utils';

export type ChangeRoleReq = {
  workspaceId: string;
  userName: string;
  role: RoleEnum;
};

export async function changeRole(params: ChangeRoleReq) {
  return request
    .post(`/report/filesystem/changeRole`, params)
    .then((res) => res.responseStatusType);
}
