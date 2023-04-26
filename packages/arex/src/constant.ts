import { ColorPrimary, getLocalStorage, I18nextLng, Theme } from 'arex-core';
import { RequestMethodEnum } from 'arex-core/src';

export enum PanesType {
  DEMO = 'demo',
  ENVIRONMENT = 'environment',
}

export enum MenusType {
  DEMO = 'demo',
  ENVIRONMENT = 'environment',
}

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

export const ExtensionVersion = '1.0.4';
export const ArexVersionKey = 'arexVersion';
export const ArexVersionValue = '0.2.8';

// localStorage key
export const THEME_KEY = 'theme';
export const USER_PROFILE_KEY = 'userProfile';
export const EMAIL_KEY = 'email'; // 初始化接口相关的 email 请使用该 key 而非 UserInfo
export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const ENVIRONMENT_KEY = 'environmentId';
export const WORKSPACE_KEY = 'workspaceId';
export const WORKSPACE_ENVIRONMENT_PAIR_KEY = 'workspaceEnvironmentPair';

// Default value
export const DEFAULT_LANGUAGE = I18nextLng.en;
export const DEFAULT_ACTIVE_MENU = MenusType.ENVIRONMENT;
export const DEFAULT_THEME =
  getLocalStorage<Theme>(THEME_KEY) ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.dark : Theme.light);
export const DEFAULT_COLOR_PRIMARY = ColorPrimary.green;

export const MAX_PANES_COUNT = 8;
