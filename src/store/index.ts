// @ts-ignore
import { toggleTheme } from '@zougt/vite-plugin-theme-preprocessor/dist/browser-utils';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { nodeType } from '../components/httpRequest/CollectionMenu';
import { MenuTypeEnum, PageTypeEnum } from '../constant';
import { ApplicationDataType, PlanItemStatistics } from '../services/Replay.type';
import { Workspace } from '../services/Workspace.type';
import { DefaultTheme, Theme, ThemeKey } from '../style/theme';

type UserInfo = {
  email: string | null;
};

// TODO 数据结构待规范
export type PaneType = {
  title: string;
  key: string;
  menuType: MenuTypeEnum;
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

  // 工作区 panes
  activePane: string;
  setActivePane: (key: string) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  activeMenu: MenuTypeEnum;
  setActiveMenu: (menu: MenuTypeEnum) => void;
  panes: PaneType[];
  setPanes: (panes: PaneType | PaneType[], mode?: 'push') => void;

  collectionTreeData: any;
  setCollectionTreeData: (collectionTreeData: any) => void;

  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;

  environmentTreeData: any;
  setEnvironmentTreeData: (environmentTreeData: any) => void;

  environment: string;
  setEnvironment: (environment: any) => void;
};

/**
 * TODO 全局store模块拆分
 * 1. 用户信息，用户配置等相关
 * 2. 主菜单/工作区（MainBox）相关
 * 3. ......
 */
export const useStore = create(
  immer<BaseState>((set, get) => ({
    userInfo: { email: localStorage.getItem('email') },
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
    activeMenu: MenuTypeEnum.Collection,
    setActiveMenu: (key: MenuTypeEnum) => {
      set({ activeMenu: key });
    },

    collectionTreeData: [],
    setCollectionTreeData: (collectionTreeData) => set({ collectionTreeData }),

    workspaces: [],
    setWorkspaces: (workspaces) => set({ workspaces }),

    environmentTreeData: [],
    setEnvironmentTreeData: (environmentTreeData) => set({ environmentTreeData }),

    environment: '0',
    setEnvironment: (environment) => set({ environment }),
  })),
);
