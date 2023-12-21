import { ColorPrimary, getLocalStorage, I18nextLng } from '@arextest/arex-core';
import { I18_KEY } from '@arextest/arex-core';

export enum Theme {
  dark = 'dark',
  light = 'light',
  system = 'system',
}

export enum PanesType {
  REQUEST = 'request',
  REPLAY = 'replay',
  REPLAY_CASE = 'replayCase',
  CASE_DETAIL = 'caseDetail',
  DIFF_SCENES = 'diffScenes',
  APP_SETTING = 'appSetting',
  SYSTEM_SETTING = 'systemSetting',
  WORKSPACE = 'workspace',
  BATCH_RUN = 'batchRun',
}

export enum MenusType {
  COLLECTION = 'collection',
  APP = 'app',
}

export enum CollectionNodeType {
  interface = 1,
  case = 2,
  folder = 3,
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

export const ExtensionVersion = '1.0.4';

export const Connector = '-_-';

// localStorage key
export const THEME_KEY = 'theme';
export const PRIMARY_COLOR_KEY = 'primaryColor';
export const COMPACT_KEY = 'compact';

export const USER_PROFILE_KEY = 'userProfile';
export const EMAIL_KEY = 'email'; // 初始化接口相关的 email 请使用该 key 而非 UserInfo
export const ACCESS_TOKEN_KEY = 'accessToken';
export const APP_ID_KEY = 'appId';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const ENVIRONMENT_KEY = 'environmentId';
export const WORKSPACE_KEY = 'workspaceId';
export const WORKSPACE_ENVIRONMENT_PAIR_KEY = 'workspaceEnvironmentPair';
export const TARGET_HOST_AUTOCOMPLETE_KEY = 'targetHostAutocomplete';

// Default value
export const DEFAULT_LANGUAGE = getLocalStorage(I18_KEY) || I18nextLng.en;
export const DEFAULT_ACTIVE_MENU = MenusType.APP;

export const isDarkSystemTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
export const getThemeByDark = (dark?: boolean) => (dark ? Theme.dark : Theme.light);

export const SYSTEM_THEME = getThemeByDark(isDarkSystemTheme);
export const DEFAULT_THEME = getLocalStorage<Theme>(THEME_KEY) || SYSTEM_THEME;
export const DEFAULT_COLOR_PRIMARY = getLocalStorage(PRIMARY_COLOR_KEY) || ColorPrimary.green;
export const DEFAULT_COMPACT = getLocalStorage<boolean>(COMPACT_KEY) || ColorPrimary.green;

export const MAX_PANES_COUNT = 8;

// custom event types
export const AREX_OPEN_NEW_PANEL = 'arexOpenNewPanel';

// electron client
export const isClient = import.meta.env.MODE === 'electron';
export const isClientDev = isClient && import.meta.env.DEV;
export const isClientProd = isClient && import.meta.env.PROD;

export const isMac = window.platform === 'darwin';
