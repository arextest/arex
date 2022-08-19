// @ts-ignore
import { toggleTheme } from '@zougt/vite-plugin-theme-preprocessor/dist/browser-utils';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { nodeType } from '../components/httpRequest/CollectionMenu';
import { MenuTypeEnum, PageTypeEnum, UserInfoKey } from '../constant';
import DefaultConfig from '../defaultConfig';
import { I18nextLng } from '../i18n';
import { FontSize } from '../pages/Setting';
import { Environment } from '../services/Environment.type';
import { ApplicationDataType, PlanItemStatistics } from '../services/Replay.type';
import { Workspace } from '../services/Workspace.type';
import { PrimaryColor, ThemeClassify, ThemeKey, ThemeName } from '../style/theme';
import { clearLocalStorage, getLocalStorage, setLocalStorage } from '../utils';

export type Profile = {
  theme: ThemeName;
  fontSize: FontSize;
  language: I18nextLng;
};
export type UserInfo = {
  email?: string;
  profile: Profile;
};

// TODO 数据结构待规范
export type PaneType = {
  title: string;
  key: string;
  menuType?: MenuTypeEnum;
  pageType: PageTypeEnum;
  isNew?: boolean;
  data?: // 不同 MenuItem 组件传递的完整数据类型, 后续不断扩充
  | nodeType // PageTypeEnum.Request 时的数据
    | ApplicationDataType // PageTypeEnum.Index 时的数据
    | PlanItemStatistics; // PageTypeEnum.ReplayAnalysis 时的数据
};

type BaseState = {
  themeClassify: ThemeClassify;
  changeTheme: (theme?: ThemeName) => void;
  extensionInstalled: boolean;
  userInfo: UserInfo;
  logout: () => void;

  activePane: string;
  setActivePane: (key: string) => void;
  setUserInfo: (data: UserInfo | string) => void;
  activeMenu: [MenuTypeEnum, string | undefined]; // [菜单id, 菜单项目id]
  setActiveMenu: (menuKey: MenuTypeEnum, menuItemKey?: string) => void;
  panes: PaneType[];

  /*
   * 修改工作区标签页数据
   * @param panes 工作区标签页数据
   * @param mode 添加模式：push，替换模式：undefined
   * */
  setPanes: (panes: PaneType | PaneType[], mode?: 'push') => void;
  resetPanes: () => void;
  collectionTreeData: any;
  setCollectionTreeData: (collectionTreeData: any) => void;

  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;

  environmentTreeData: Environment[];
  setEnvironmentTreeData: (environmentTreeData: Environment[]) => void;

  activeEnvironment?: Environment;
  setActiveEnvironment: (environment: Environment | string) => void;
};

const initUserInfo = (() => {
  const userInfo = getLocalStorage<UserInfo>(UserInfoKey);
  if (userInfo && userInfo?.email && userInfo?.profile) {
    return userInfo;
  } else {
    return {
      email: undefined,
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

    themeClassify:
      (getLocalStorage<ThemeName>(ThemeKey)?.split('-')?.at(0) as ThemeClassify | undefined) ||
      DefaultConfig.themeClassify,
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
        setLocalStorage(ThemeKey, newTheme);
        state.userInfo!.profile.theme = themeName;
        state.themeClassify = themeName.split('-')[0] as ThemeClassify;
      });
    },
    extensionInstalled: false,

    activePane: '',
    setActivePane: (key: string) => {
      set({ activePane: key });
    },

    panes: [],
    setPanes: (panes, mode) => {
      if (!mode) {
        set({ panes: panes as PaneType[] });
      }

      if (mode === 'push') {
        // immer push new pane and set activePane
        const pane = panes as PaneType;
        set((state) => {
          if (!state.panes.find((i) => i.key === pane.key)) {
            state.panes.push(pane);
          }
          state.activePane = pane.key;
        });
      }
    },
    activeMenu: [MenuTypeEnum.Collection, undefined],
    setActiveMenu: (menuKey, menuItemKey) => {
      set({ activeMenu: [menuKey, menuItemKey] });
    },
    resetPanes: () => {
      set({ panes: [], activePane: '', activeMenu: [MenuTypeEnum.Collection, undefined] });
    },

    logout: () => {
      clearLocalStorage();
      set({ userInfo: undefined, panes: [], activePane: '' });
    },

    collectionTreeData: [],
    setCollectionTreeData: (collectionTreeData) => set({ collectionTreeData }),

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
  })),
);

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
}
