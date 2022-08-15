// @ts-ignore
import { toggleTheme } from '@zougt/vite-plugin-theme-preprocessor/dist/browser-utils';
import React from 'react';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { nodeType } from '../components/httpRequest/CollectionMenu';
import { MenuTypeEnum, PageTypeEnum } from '../constant';
import { Environment } from '../services/Environment.type';
import { ApplicationDataType, PlanItemStatistics } from '../services/Replay.type';
import { Workspace } from '../services/Workspace.type';
import { DefaultTheme, Theme, ThemeKey } from '../style/theme';

type UserInfo = {
  email: string | null;
  profile: {
    background: string;
    accentColor: string;
    fontSize: string;
    language: string;
  };
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
  theme: Theme;
  changeTheme: (theme?: Theme) => void;
  extensionInstalled: boolean;
  userInfo?: UserInfo;
  logout: () => void;

  activePane: string;
  setActivePane: (key: string) => void;
  setUserInfo: (userInfo: UserInfo) => void;
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

/**
 * TODO 全局store模块拆分
 * 1. 用户信息，用户配置等相关
 * 2. 主菜单/工作区（MainBox）相关
 * 3. ......
 */

export const useStore = create(
  immer<BaseState>((set, get) => ({
    userInfo: {
      email: localStorage.getItem('email'),
      profile: {
        background: 'light',
        accentColor: '#603BE3',
        fontSize: 'small',
        language: 'english',
      },
    },
    setUserInfo: (userInfo: BaseState['userInfo']) => set({ userInfo }),

    theme: (localStorage.getItem(ThemeKey) as Theme) || DefaultTheme,
    changeTheme: (theme?: Theme) => {
      set((state) => {
        const newTheme = theme || (state.theme === Theme.light ? Theme.dark : Theme.light);
        toggleTheme({
          scopeName: newTheme,
        });
        localStorage.setItem(ThemeKey, newTheme);
        return {
          theme: newTheme,
        };
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
      localStorage.removeItem('email');
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
