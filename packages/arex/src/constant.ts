import {
  ColorPrimary,
  getLocalStorage,
  I18_KEY,
  I18nextLng,
  Theme as ArexTheme,
} from '@arextest/arex-core';

export enum Theme {
  dark = ArexTheme.dark,
  light = ArexTheme.light,
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

export enum MessageType {
  update,
  extension,
}

export const ResponseCode = {
  SUCCESS: 0,
  REQUESTED_PARAMETER_INVALID: 1,
  REQUESTED_HANDLE_EXCEPTION: 2,
  REQUESTED_RESOURCE_NOT_FOUND: 3,
  AUTHENTICATION_FAILED: 4,

  APP_AUTH_NO_APP_ID: 105001,
  APP_AUTH_ERROR_APP_ID: 105002,
  APP_AUTH_NO_PERMISSION: 105003,
};

export const ErrorResponseMessage = {
  [ResponseCode.AUTHENTICATION_FAILED]: 'common:message.authenticationFailed',
  [ResponseCode.APP_AUTH_NO_APP_ID]: 'common:message.noAppId',
  [ResponseCode.APP_AUTH_ERROR_APP_ID]: 'common:message.errorAppId',
  [ResponseCode.APP_AUTH_NO_PERMISSION]: 'common:message.noPermission',
} as const;

export const RoleMap = {
  [RoleEnum.Admin]: 'Admin',
  [RoleEnum.Editor]: 'Editor',
  [RoleEnum.Viewer]: 'Viewer',
};

export const Connector = '-_-';

// localStorage key
export const THEME_KEY = 'theme';
export const PRIMARY_COLOR_KEY = 'primaryColor';
export const COMPACT_KEY = 'compact';

export const USER_PROFILE_KEY = 'userProfile';
export const EMAIL_KEY = 'email'; // 初始化接口相关的 email 请使用该 key 而非 UserInfo
export const COMPANY_KEY = 'company';
export const ACCESS_TOKEN_KEY = 'accessToken';
export const APP_ID_KEY = 'appId';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const ENVIRONMENT_KEY = 'environmentId';
export const WORKSPACE_KEY = 'workspaceId';
export const WORKSPACE_ENVIRONMENT_PAIR_KEY = 'workspaceEnvironmentPair';
export const TARGET_HOST_AUTOCOMPLETE_KEY = 'targetHostAutocomplete';
export const BATCH_RUN_QPS_KEY = 'batchRunQps';

// Default value
export const DEFAULT_LANGUAGE = getLocalStorage<I18nextLng>(I18_KEY) || I18nextLng.en;
export const DEFAULT_ACTIVE_MENU = MenusType.APP;

export const isDarkSystemTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
export function getThemeByDark(dark?: boolean) {
  return ArexTheme[dark ? 'dark' : 'light'];
}

export const SYSTEM_THEME = getThemeByDark(isDarkSystemTheme);
export const DEFAULT_THEME = getLocalStorage<Theme>(THEME_KEY) || SYSTEM_THEME;
export const DEFAULT_COLOR_PRIMARY =
  getLocalStorage<ColorPrimary>(PRIMARY_COLOR_KEY) || ColorPrimary.green;
export const DEFAULT_COMPACT = getLocalStorage<boolean>(COMPACT_KEY) || true;

export const MAX_PANES_COUNT = 8;

// custom event types
export const AREX_OPEN_NEW_PANEL = 'arexOpenNewPanel';

// electron client
export const isClient = import.meta.env.MODE === 'electron';
export const isClientDev = isClient && import.meta.env.DEV;
export const isClientProd = isClient && import.meta.env.PROD;

export const isMac = window.platform === 'darwin';

// LINK_URL

export const URL_AREX = 'https://docs.arextest.com';
export const URL_DOCUMENT_GET_STARTED = 'https://docs.arextest.com/docs/category/get-started';
export const URL_DOCUMENT_MOCK_CONFIG = 'https://docs.arextest.com/docs/chapter3/Mock%20Config/';
export const URL_GITHUB_ISSUES = 'https://github.com/arextest/arex/issues';
export const URL_X = 'https://x.com/AREX_Test';
export const URL_SLACK =
  'https://join.slack.com/t/arexcommunity/shared_invite/zt-1pb0qukhd-tnLVZN3aisHfIo5SzBjj0Q';
export const URL_CHROME_EXTENSION =
  'https://chromewebstore.google.com/detail/arex-chrome-extension/jmmficadjneeekafmnheppeoehlgjdjj';
