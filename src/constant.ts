export const ExtensionVersion = '1.0.4';

export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
export enum MethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
export const MethodMap = {
  GET: {
    color: '#0cbb52',
  },
  PUT: {
    color: '#097bed',
  },
  POST: {
    color: '#ffb400',
  },
  DELETE: {
    color: '#eb2013',
  },
  PATCH: {
    color: '#d3adf7',
  },
  UNKNOWN: {
    color: '#0cbb52',
  },
} as const;

export enum NodeType {
  interface = 1,
  case = 2,
  folder = 3,
}

export enum ContentTypeEnum {
  ApplicationJson = 'application/json',
}

export enum RoleEnum {
  Admin = 1,
  Editor = 2,
  Viewer = 3,
}

export const RoleMap = {
  [RoleEnum.Admin]: 'Admin',
  [RoleEnum.Editor]: 'Editor',
  [RoleEnum.Viewer]: 'Viewer',
};

// localStorage key
export const UserProfileKey = 'userProfile';
export const EmailKey = 'email'; // 初始化接口相关的 email 请使用该 key 而非 UserInfo
export const AccessTokenKey = 'accessToken';
export const RefreshTokenKey = 'refreshToken';
export const CollapseMenuKey = 'collapseMenu';
export const EnvironmentKey = 'environmentId';
export const WorkspaceKey = 'workspaceId';
export const I18Key = 'i18nextLng';
export const WorkspaceEnvironmentPairKey = 'workspaceEnvironmentPair';
