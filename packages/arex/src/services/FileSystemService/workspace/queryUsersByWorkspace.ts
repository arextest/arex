import { getLocalStorage } from '@arextest/arex-core';

import { EMAIL_KEY } from '@/constant';
import { request } from '@/utils';

export type WorkspaceUser = {
  userName: string;
  role: number;
  status: number;
};

export interface QueryUsersByWorkspaceRes {
  users: WorkspaceUser[];
}

export async function queryUsersByWorkspace(params: { workspaceId: string }) {
  return request
    .post<QueryUsersByWorkspaceRes>(`/webApi/filesystem/queryUsersByWorkspace`, params)
    .then((res) =>
      // 排序规则 userName为当前用户 大于 role 大于 userName 首字母
      res.body.users.sort((a, b) => {
        if (a.userName === getLocalStorage(EMAIL_KEY)) {
          return -1;
        } else if (a.role === b.role) {
          return a.userName.localeCompare(b.userName);
        } else {
          return a.role - b.role;
        }
      }),
    );
}
