import {
  ColorPrimary,
  getLocalStorage,
  I18nextLng,
  RequestMethodEnum,
  Theme,
} from '@arextest/arex-core';

export enum PanesType {
  DEMO = 'demo',
  COMPONENTS = 'components',
  REQUEST = 'request',
}

export enum MenusType {
  COLLECTION = 'collection',
  DEMO = 'demo',
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

export const methodMap: Record<RequestMethodEnum, { color: string }> = {
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
    color: '#212121',
  },
};

export enum NodeType {
  interface = 1,
  case = 2,
  folder = 3,
}

// localStorage key
export const THEME_KEY = 'theme';
export const USER_PROFILE_KEY = 'userProfile';
export const EMAIL_KEY = 'email'; // 初始化接口相关的 email 请使用该 key 而非 UserInfo
export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const ENVIRONMENT_KEY = 'environmentId';
export const WORKSPACE_KEY = 'workspaceId';
export const WORKSPACE_ENVIRONMENT_PAIR_KEY = 'workspaceEnvironmentPair';
export const TARGET_HOST_AUTOCOMPLETE_KEY = 'targetHostAutocomplete';

// Default value
export const DEFAULT_LANGUAGE = I18nextLng.en;
export const DEFAULT_ACTIVE_MENU = MenusType.DEMO;
export const DEFAULT_THEME =
  getLocalStorage<Theme>(THEME_KEY) ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.dark : Theme.light);
export const DEFAULT_COLOR_PRIMARY = ColorPrimary.green;

export const MAX_PANES_COUNT = 8;
