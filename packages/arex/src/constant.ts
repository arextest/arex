import { ColorPrimary, getLocalStorage, I18nextLng, Theme } from '@arextest/arex-core';

export enum PanesType {
  REQUEST = 'request',
  REPLAY = 'replay',
  REPLAY_CASE = 'replayCase',
  CASE_DETAIL = 'caseDetail',
  DIFF_SCENES = 'diffScenes',
  REPLAY_ANALYSIS = 'replayAnalysis',
  APP_SETTING = 'appSetting',
  ENVIRONMENT = 'environment',
  USER_SETTING = 'userSetting',
  WORKSPACE = 'workspace',
  BATCH_RUN = 'batchRun',
}

export enum MenusType {
  COLLECTION = 'collection',
  REPLAY = 'replay',
  APP_SETTING = 'appSetting',
  ENVIRONMENT = 'environment',
}

export enum CollectionNodeType {
  interface = 1,
  case = 2,
  folder = 3,
}

export const ExtensionVersion = '1.0.4';
export const ArexVersionKey = 'arexVersion';
export const ArexVersionValue = '0.4.1';

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
export const DEFAULT_ACTIVE_MENU = MenusType.REPLAY;
export const DEFAULT_THEME =
  getLocalStorage<Theme>(THEME_KEY) ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.dark : Theme.light);
export const DEFAULT_COLOR_PRIMARY = ColorPrimary.green;

export const MAX_PANES_COUNT = 8;

// custom event type
export const AREX_OPEN_NEW_PANEL = 'arexOpenNewPanel';
