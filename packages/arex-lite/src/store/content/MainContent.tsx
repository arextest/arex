import produce, { Draft } from 'immer';
import { createContext, Dispatch, FC, useReducer } from 'react';

// import { MenuTypeEnum } from '../../constant';
export const HoppAccentColors = [
  'green',
  'teal',
  'blue',
  'indigo',
  'purple',
  'yellow',
  'orange',
  'red',
  'pink',
  '#3b82f6',
] as const;
export const HoppBgColors = ['system', 'light', 'dark', 'black'] as const;
export const HoppFontSizes = ['small', 'medium', 'large'] as const;

export type HoppFontSize = (typeof HoppFontSizes)[number];
export type HoppBgColor = (typeof HoppBgColors)[number];
export type HoppAccentColor = (typeof HoppAccentColors)[number];
export type SettingsType = {
  consoleFeedDrawerOpen: boolean;
  syncCollections: boolean;
  syncHistory: boolean;
  syncEnvironments: boolean;

  PROXY_ENABLED: boolean;
  PROXY_URL: string;
  EXTENSIONS_ENABLED: boolean;
  URL_EXCLUDES: {
    auth: boolean;
    httpUser: boolean;
    httpPassword: boolean;
    bearerToken: boolean;
    oauth2Token: boolean;
  };
  THEME_COLOR: HoppAccentColor;
  BG_COLOR: HoppBgColor;
  TELEMETRY_ENABLED: boolean;
  EXPAND_NAVIGATION: boolean;
  SIDEBAR: boolean;
  SIDEBAR_ON_LEFT: boolean;
  ZEN_MODE: boolean;
  FONT_SIZE: HoppFontSize;
  COLUMN_LAYOUT: boolean;
  LANGUAGE: string;
};
export type globalStateType = {
  activeMenu: any[];
  panes: any[];
  collectionTreeData: any[];
  environments: any[];
  activeEnvironment: string;
};
const defaultMainState: {
  settings: SettingsType;
  globalState: globalStateType;
} = {
  settings: {
    consoleFeedDrawerOpen: false,
    syncCollections: true,
    syncHistory: true,
    syncEnvironments: true,

    PROXY_ENABLED: false,
    PROXY_URL: 'https://proxy.hoppscotch.io/',
    EXTENSIONS_ENABLED: false,
    URL_EXCLUDES: {
      auth: true,
      httpUser: true,
      httpPassword: true,
      bearerToken: true,
      oauth2Token: true,
    },
    THEME_COLOR: '#3b82f6',
    BG_COLOR: 'system',
    TELEMETRY_ENABLED: true,
    EXPAND_NAVIGATION: true,
    SIDEBAR: true,
    SIDEBAR_ON_LEFT: true,
    ZEN_MODE: false,
    FONT_SIZE: 'small',
    COLUMN_LAYOUT: true,
    LANGUAGE: 'en',
  },
  globalState: {
    activeMenu: [`MenuTypeEnum.Collection`, undefined],
    panes: [],
    collectionTreeData: [],
    environments: [],
    activeEnvironment: 'No environment',
  },
};
export interface MainState {
  settings: SettingsType;
  globalState: globalStateType;
}

export const MainContext = createContext<
  { store: MainState } & { dispatch: Dispatch<(state: MainState) => void> }
>({
  store: defaultMainState,
  dispatch: () => undefined,
});
function reducer(draft: Draft<MainState>, action: (state: MainState) => void) {
  return action(draft);
}
const MainProvider: FC<any> = ({ children }) => {
  const [store, dispatch] = useReducer(produce(reducer), defaultMainState);

  return <MainContext.Provider value={{ store, dispatch }}>{children}</MainContext.Provider>;
};

export default MainProvider;
