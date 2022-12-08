import React from 'react';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { EmailKey } from '../constant';
import { getLocalStorage, setLocalStorage } from '../helpers/utils';
import { MenusType } from '../menus';
import { nodeType } from '../menus/CollectionMenu';
import { PageType } from '../pages';
import { NodeList } from '../services/CollectionService';
import { Environment } from '../services/Environment.type';
import { ApplicationDataType, PlanItemStatistics } from '../services/Replay.type';
import { Workspace } from '../services/Workspace.type';

// 不同 MenuItem 组件传递的完整数据类型, 后续不断扩充
export type PageData =
  | undefined
  | nodeType // PageTypeEnum.Request 时的数据
  | ApplicationDataType // PageTypeEnum.Replay 时的数据
  | PlanItemStatistics // PageTypeEnum.ReplayAnalysis 时的数据
  | Environment;

export type Page<D extends PageData = undefined> = {
  title: string;
  key?: string;
  menuType?: MenusType;
  pageType: PageType<string>;
  isNew?: boolean;
  data: D;
  sortIndex?: number;
  paneId: string;
  rawId: React.Key;
};

type ActiveMenu = [MenusType | undefined, string | undefined]; // [菜单id, 菜单项目id]
type SetPagesMode = 'push' | 'normal';
type BaseState = {
  logout: () => void;

  activeMenu: ActiveMenu;
  setActiveMenu: (menuKey?: MenusType, menuItemKey?: string) => void;

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
  removePage: (removePaneId: string) => void;
  resetPanes: () => void;

  collectionTreeData: NodeList[];
  setCollectionTreeData: (collectionTreeData: NodeList[]) => void;
  collectionLastManualUpdateTimestamp: number;
  setCollectionLastManualUpdateTimestamp: (timestamp: number) => void;

  invitedWorkspaceId: string;
  setInvitedWorkspaceId: (workspaceId: string) => void;

  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;

  environmentTreeData: Environment[];
  setEnvironmentTreeData: (environmentTreeData: Environment[]) => void;
  environmentLastManualUpdateTimestamp: number;
  setEnvironmentLastManualUpdateTimestamp: (timestamp: number) => void;

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
    removePage(removePaneId) {
      const menuType = get().activeMenu[0];
      const filteredPanes = get().pages.filter((i) => i.paneId !== removePaneId);
      get().setPages(filteredPanes);

      if (filteredPanes.length) {
        const lastPane = filteredPanes.reduce((pane, cur) => {
          if ((cur.sortIndex || 0) > (pane.sortIndex || 0)) pane = cur;
          return pane;
        }, filteredPanes[0]);

        get().setActiveMenu(lastPane.menuType, lastPane.paneId);
      } else {
        get().setActiveMenu(menuType);
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
      const email = getLocalStorage<string>(EmailKey);
      localStorage.clear();
      email?.startsWith('GUEST') && setLocalStorage(EmailKey, email);
      set({ pages: [] });
    },

    collectionTreeData: [],
    setCollectionTreeData: (collectionTreeData) => set({ collectionTreeData }),

    collectionLastManualUpdateTimestamp: new Date().getTime(),
    setCollectionLastManualUpdateTimestamp: (timestamp) => {
      set({ collectionLastManualUpdateTimestamp: timestamp });
    },

    invitedWorkspaceId: '',
    setInvitedWorkspaceId: (workspaceId) => set({ invitedWorkspaceId: workspaceId }),

    workspaces: [],
    setWorkspaces: (workspaces) => set({ workspaces }),

    environmentTreeData: [],
    setEnvironmentTreeData: (environmentTreeData) => set({ environmentTreeData }),
    environmentLastManualUpdateTimestamp: new Date().getTime(),
    setEnvironmentLastManualUpdateTimestamp: (timestamp) => {
      set({ environmentLastManualUpdateTimestamp: timestamp });
    },

    activeEnvironment: undefined,
    setActiveEnvironment: (environment) => {
      if (typeof environment === 'string') {
        const environmentTreeData = get().environmentTreeData;
        set({
          activeEnvironment: environmentTreeData.find((i) => i.id === environment),
        });
      } else {
        set({ activeEnvironment: environment });
      }
    },
  })),
);

// @ts-ignore
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('BaseStore', useStore);
}
