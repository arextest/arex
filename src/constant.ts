export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
export enum MethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum NodeType {
  interface = 1,
  case = 2,
  folder = 3,
}

export enum MenuTypeEnum {
  Collection = 'collection',
  Replay = 'replay',
  Environment = 'environment',
}

export enum PageTypeEnum {
  Setting = 'setting',
  Request = 'request',
  Folder = 'folder',
  Collection = 'collection',
  Environment = 'environment',
  WorkspaceOverview = 'workspaceOverview',
  Replay = 'replay',
  ReplayAnalysis = 'replayAnalysis',
  ReplayCase = 'replayCase',
  ReplaySetting = 'replaySetting',
}

export enum ContentTypeEnum {
  ApplicationJson = 'application/json',
}

export enum RoleEnum {
  Admin = 1,
  Editor = 2,
  Viewer = 3,
}

export enum FontSizeMap {
  small = 0.9,
  medium = 1,
  large = 1.1,
}

// localStorage key
export const UserInfoKey = 'userInfo';
export const AccessTokenKey = 'accessToken';
export const RefreshTokenKey = 'refreshToken';
export const CollapseMenuKey = 'collapseMenu';
