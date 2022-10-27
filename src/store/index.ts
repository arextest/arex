// @ts-ignore
import { toggleTheme } from '@zougt/vite-plugin-theme-preprocessor/dist/browser-utils';
import React from 'react';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { UserInfoKey } from '../constant';
import DefaultConfig from '../defaultConfig';
import { clearLocalStorage, getLocalStorage, setLocalStorage } from '../helpers/utils';
import { I18nextLng } from '../i18n';
import { MenusType } from '../menus';
import { nodeType } from '../menus/CollectionMenu';
import { PageType } from '../pages';
import { FontSize } from '../pages/SettingPage';
import { NodeList } from '../services/CollectionService';
import { Environment } from '../services/Environment.type';
import { ApplicationDataType, PlanItemStatistics } from '../services/Replay.type';
import { Workspace } from '../services/Workspace.type';
import { PrimaryColor, ThemeClassify, ThemeName } from '../style/theme';

export type Profile = {
  theme: ThemeName;
  fontSize: FontSize;
  language: I18nextLng;
};
export type UserInfo = {
  email?: string;
  profile: Profile;
};

// 不同 MenuItem 组件传递的完整数据类型, 后续不断扩充
export type PageData =
  | undefined
  | nodeType // PageTypeEnum.Request 时的数据
  | ApplicationDataType // PageTypeEnum.Replay 时的数据
  | PlanItemStatistics; // PageTypeEnum.ReplayAnalysis 时的数据

export type Page<D extends PageData = undefined> = {
  title: string;
  key?: string;
  menuType: MenusType;
  pageType: PageType<string>;
  isNew?: boolean;
  data: D;
  sortIndex?: number;
  paneId: string;
  rawId: React.Key;
};

type ActiveMenu = [MenusType, string | undefined]; // [菜单id, 菜单项目id]
type SetPagesMode = 'push' | 'normal';
type BaseState = {
  themeClassify: ThemeClassify;
  changeTheme: (theme?: ThemeName) => void;
  extensionInstalled: boolean;
  extensionVersion: string;
  userInfo: UserInfo;
  logout: () => void;
  setUserInfo: (data: UserInfo | string) => void;
  activeMenu: ActiveMenu;
  setActiveMenu: (menuKey: MenusType, menuItemKey?: string) => void;
  pages: Page<PageData>[];
  /*
   * 修改工作区标签页数据
   * @param pages 工作区标签页数据
   * @param mode 添加模式：push，替换模式：undefined
   * */
  setPages: <D extends PageData = undefined, M extends SetPagesMode = 'normal'>(
    pages: M extends 'push' ? Page<D> : Page<D>[],
    mode?: M,
  ) => void;
  resetPanes: () => void;

  collectionTreeData: NodeList[];
  setCollectionTreeData: (collectionTreeData: NodeList[]) => void;
  collectionLastManualUpdateTimestamp: number;
  setCollectionLastManualUpdateTimestamp: (timestamp: number) => void;

  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;

  environmentTreeData: Environment[];
  setEnvironmentTreeData: (environmentTreeData: Environment[]) => void;

  activeEnvironment?: Environment;
  setActiveEnvironment: (environment: Environment | string) => void;

  currentEnvironment?: Environment;
  setCurrentEnvironment: (currentEnvironment: Environment | string) => void;
};

const initUserInfo = (() => {
  const userInfo = getLocalStorage<UserInfo>(UserInfoKey);
  if (userInfo && userInfo?.email && userInfo?.profile) {
    return userInfo;
  } else {
    return {
      email: '',
      profile: {
        theme: DefaultConfig.theme,
        fontSize: DefaultConfig.fontSize,
        language: DefaultConfig.language,
      },
    };
  }
})();

/**
 * TODO 全局store模块拆分
 * 1. 用户信息，用户配置等相关
 * 2. 主菜单/工作区（MainBox）相关
 * 3. ......
 */
export const useStore = create(
  immer<BaseState>((set, get) => ({
    userInfo: initUserInfo,
    setUserInfo: (data) => {
      if (typeof data === 'string') {
        // update email
        set((state) => {
          state.userInfo.email = data;
          console.log('update email', state.userInfo);
          setLocalStorage(UserInfoKey, state.userInfo);
        });
      } else {
        // overwrite userInfo
        set({ userInfo: data });
        setLocalStorage(UserInfoKey, data);
      }
    },
    extensionVersion: '1.0.4',
    themeClassify:
      (getLocalStorage<UserInfo>(UserInfoKey)?.profile?.theme?.split('-')?.at(0) as
        | ThemeClassify
        | undefined) || DefaultConfig.themeClassify,
    changeTheme: (theme) => {
      set((state) => {
        let newTheme = theme;
        if (!theme) {
          const [themeMode, primaryColor] = state.userInfo.profile.theme.split('-');
          const newThemeMode =
            themeMode === ThemeClassify.light ? ThemeClassify.dark : ThemeClassify.light;
          newTheme = `${newThemeMode}-${primaryColor as PrimaryColor}`;
        }

        const themeName = newTheme as ThemeName;
        toggleTheme({
          scopeName: newTheme,
        });
        state.userInfo!.profile.theme = themeName;
        state.themeClassify = themeName.split('-')[0] as ThemeClassify;
      });
    },

    extensionInstalled: false,

    pages: [],
    setPages: (pages, mode: SetPagesMode = 'normal') => {
      if (mode === 'normal') {
        set({ pages: pages as Page[] });
      } else if (mode === 'push') {
        // insert or update
        const page = pages as Page;
        set((state) => {
          const sortIndexArr = state.pages.map((i) => i.sortIndex || 0);
          const statePane = state.pages.find((i) => i.paneId === page.paneId);
          const maxSortIndex = Math.max(...(sortIndexArr.length > 0 ? sortIndexArr : [0])) + 1;

          if (statePane) {
            // page already exist, just update sortIndex
            statePane.sortIndex = maxSortIndex;
          } else {
            // insert new page with sortIndex
            state.pages.push({
              ...page,
              sortIndex: maxSortIndex,
            });
          }
          // state.activePane = page.paneId;
          state.activeMenu = [page.menuType || MenusType.Collection, page.paneId];
        });
      }
    },

    activeMenu: [MenusType.Collection, undefined],
    setActiveMenu: (menuKey, menuItemKey) => {
      set((state) => {
        const statePane = state.pages.find((i) => i.paneId === menuItemKey);
        if (statePane) {
          // 每次选择tab的时候将sortIndex设置到最大，然后每次点击关闭的时候激活上最大的sort
          const sortIndexArr = state.pages.map((i) => i.sortIndex || 0);
          statePane.sortIndex = Math.max(...(sortIndexArr.length > 0 ? sortIndexArr : [0])) + 1;
        }
        const key = menuKey ? menuKey : statePane?.menuType || MenusType.Collection;
        state.activeMenu = [key, menuItemKey];
      });

      set({ activeMenu: [menuKey, menuItemKey] });
    },

    resetPanes: () => {
      set({ pages: [], activeMenu: [MenusType.Collection, undefined] });
    },

    logout: () => {
      clearLocalStorage('accessToken');
      clearLocalStorage('refreshToken');
      clearLocalStorage('userInfo');
      set({ userInfo: undefined, pages: [] });
    },

    collectionTreeData: [],
    setCollectionTreeData: (collectionTreeData) => set({ collectionTreeData }),

    collectionLastManualUpdateTimestamp: new Date().getTime(),
    setCollectionLastManualUpdateTimestamp: (timestamp) => {
      set({ collectionLastManualUpdateTimestamp: timestamp });
    },

    workspaces: [],
    setWorkspaces: (workspaces) => set({ workspaces }),

    environmentTreeData: [],
    setEnvironmentTreeData: (environmentTreeData) => set({ environmentTreeData }),

    activeEnvironment: undefined,
    setActiveEnvironment: (environment) => {
      if (typeof environment === 'string') {
        const environmentTreeData = get().environmentTreeData;
        set({ activeEnvironment: environmentTreeData.find((i) => i.id === environment) });
      } else {
        set({ activeEnvironment: environment });
      }
    },

    currentEnvironment: { id: '0', envName: '', keyValues: [] },
    setCurrentEnvironment: (environment) => {
      if (environment !== '0') {
        const environmentTreeData = get().environmentTreeData;
        set({ currentEnvironment: environmentTreeData.find((i) => i.id === environment) });
      } else {
        set({ currentEnvironment: { id: '0', envName: '', keyValues: [] } });
      }
    },
  })),
);

// @ts-ignore
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
}
