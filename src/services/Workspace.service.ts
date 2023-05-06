import { EmailKey } from '../constant';
import request from '../helpers/api/axios';
import { getLocalStorage } from '../helpers/utils';
import {
  ChangeRoleReq,
  CreateWorkspaceReq,
  CreateWorkspaceRes,
  DeleteWorkspaceReq,
  QueryUsersByWorkspaceReq,
  QueryUsersByWorkspaceRes,
  RemoveUserFromWorkspaceReq,
  ValidInvitationReq,
  ValidInvitationRes,
  Workspace,
} from './Workspace.type';

export default class WorkspaceService {
  static listWorkspace({ userName }: { userName: string }) {
    return request
      .post<{ workspaces: Workspace[] }>(`/report/filesystem/queryWorkspacesByUser`, {
        userName,
      })
      .then((res) => res.body.workspaces);
  }

  static queryUsersByWorkspace(params: QueryUsersByWorkspaceReq) {
    return request
      .post<QueryUsersByWorkspaceRes>(`/report/filesystem/queryUsersByWorkspace`, params)
      .then((res) =>
        // 排序规则 userName为当前用户 大于 role 大于 userName 首字母
        res.body.users.sort((a, b) => {
          if (a.userName === getLocalStorage(EmailKey)) {
            return -1;
          } else if (a.role === b.role) {
            return a.userName.localeCompare(b.userName);
          } else {
            return a.role - b.role;
          }
        }),
      );
  }

  static createWorkspace({ userName, workspaceName }: CreateWorkspaceReq) {
    return request
      .post<CreateWorkspaceRes>(`/report/filesystem/addItem`, {
        nodeName: 'New Collection',
        nodeType: '3',
        userName,
        workspaceName,
      })
      .then((res) => Promise.resolve(res.body));
  }

  static renameWorkspace({ workspaceId, newName, userName }: any) {
    return request.post(`/report/filesystem/renameWorkspace`, {
      id: workspaceId,
      workspaceName: newName,
      userName,
    });
  }

  static deleteWorkspace(params: DeleteWorkspaceReq) {
    return request
      .post<boolean>(`/report/filesystem/deleteWorkspace`, params)
      .then((res) => res.body);
  }

  static inviteToWorkspace(params: any) {
    return request.post(`/report/filesystem/inviteToWorkspace`, params);
  }

  static validInvitation(params: ValidInvitationReq) {
    return request.post<ValidInvitationRes>(`/report/filesystem/validInvitation`, params);
  }

  static changeRole(params: ChangeRoleReq) {
    return request
      .post(`/report/filesystem/changeRole`, params)
      .then((res) => res.responseStatusType);
  }

  static removeUserFromWorkspace(params: RemoveUserFromWorkspaceReq) {
    return request
      .post(`/report/filesystem/removeUserFromWorkspace`, params)
      .then((res) => res.responseStatusType);
  }

  static leaveWorkspace(params: { workspaceId: string }) {
    return request
      .post<{ success: boolean }>(`/report/filesystem/leaveWorkspace`, params)
      .then((res) => res.body.success);
  }
}
