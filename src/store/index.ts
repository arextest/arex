import React from 'react';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { nodeType } from '../components/menus/CollectionMenu';
import { PageType } from '../components/panes';
import { EmailKey, WorkspaceEnvironmentPairKey, WorkspaceKey } from '../constant';
import { MenusType } from '../enums/menus';
import { getLocalStorage, setLocalStorage } from '../helpers/utils';
import { NodeObject } from '../services/Collection.service';
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
   * @param panes 工作区标签页数据
   * @param mode 添加模式：push，替换模式：undefined
   * */
  setPages: <D extends PageData = undefined, M extends SetPagesMode = 'normal'>(
    pages: M extends 'push' ? Page<D> : Page<D>[],
    mode?: M,
  ) => void;
  removePage: (pageId: string) => void;
  removeSegmentPages: (targetPageId: string, segment: 'left' | 'right') => void;
  resetPage: () => void;

  collectionTreeData: NodeObject[];
  setCollectionTreeData: (collectionTreeData: NodeObject[]) => void;
  collectionLastManualUpdateTimestamp: number;
  setCollectionLastManualUpdateTimestamp: (timestamp: number) => void;

  invitedWorkspaceId: string;
  setInvitedWorkspaceId: (workspaceId: string) => void;

  activeWorkspaceId: string;
  setActiveWorkspaceId: (activeWorkspaceId: string) => void;

  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;
  workspacesLastManualUpdateTimestamp: number;
  setWorkspacesLastManualUpdateTimestamp: (timestamp: number) => void;

  environmentTreeData: Environment[];
  setEnvironmentTreeData: (environmentTreeData: Environment[]) => void;
  environmentLastManualUpdateTimestamp: number;
  setEnvironmentLastManualUpdateTimestamp: (timestamp: number) => void;

  activeEnvironment?: Environment;
  setActiveEnvironment: (environment?: Environment | string) => void;
};

export const DefaultEnvironment = { envName: 'No Environment', id: '0' };

export const useStore = create(
  immer<BaseState>((set, get) => ({
    pages: [],
    setPages: (pages, mode: SetPagesMode = 'normal') => {
      // setPages函数完成了添加新page，并且激活它的操作。
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
            if (state.pages.length > 9) {
              state.pages.shift();
            }
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
    removeSegmentPages: (targetPageId, segment) => {
      const pages = get().pages;
      const index = pages.findIndex((page) => page.paneId === targetPageId);
      Number.isInteger(index) &&
        set({
          pages: segment === 'left' ? pages.slice(index, pages.length) : pages.slice(0, index + 1),
        });
    },
    resetPage: () => {
      set({ pages: [], activeMenu: [MenusType.Collection, undefined] });
    },

    activeMenu: [MenusType.Replay, undefined],
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

    activeWorkspaceId: '',
    setActiveWorkspaceId: (activeWorkspaceId) => {
      set({ activeWorkspaceId });
      setLocalStorage(WorkspaceKey, activeWorkspaceId);

      // 更新 activeEnvironment 为当前 workspace 下的默认值
      get().setActiveEnvironment();
    },

    workspaces: [],
    setWorkspaces: (workspaces) => set({ workspaces }),
    workspacesLastManualUpdateTimestamp: new Date().getTime(),
    setWorkspacesLastManualUpdateTimestamp: (timestamp) => {
      set({ workspacesLastManualUpdateTimestamp: timestamp });
    },

    environmentTreeData: [],
    setEnvironmentTreeData: (environmentTreeData) => {
      set({ environmentTreeData });

      // 初次加载 environmentTreeData 时恢复 activeEnvironment 的缓存状态
      get().setActiveEnvironment();
    },
    environmentLastManualUpdateTimestamp: new Date().getTime(),
    setEnvironmentLastManualUpdateTimestamp: (timestamp) =>
      set({ environmentLastManualUpdateTimestamp: timestamp }),

    activeEnvironment: DefaultEnvironment,
    setActiveEnvironment: (environment) => {
      // 从 localStorage 中读取工作空间的缓存值
      if (!environment) {
        // 先设置为默认值，后面再可能设置为有效值，避免有效值不存在时环境变量仍属于上一个工作空间
        set({ activeEnvironment: DefaultEnvironment });

        const workspaceEnvironmentPair = getLocalStorage<WorkspaceEnvironmentPair>(
          WorkspaceEnvironmentPairKey,
        );
        const environmentId = workspaceEnvironmentPair?.[get().activeWorkspaceId];
        environmentId && get().setActiveEnvironment(environmentId);
      }
      // 根据 id 从 environmentTreeData 中读取保存
      else if (typeof environment === 'string') {
        const environmentTreeData = get().environmentTreeData;
        const activeEnvironment =
          environment === DefaultEnvironment.id
            ? DefaultEnvironment
            : environmentTreeData.find((i) => i.id === environment);
        if (activeEnvironment) {
          set({
            activeEnvironment,
          });
          updateWorkspaceEnvironmentLS(get().activeWorkspaceId, activeEnvironment.id);
        }
      }
      // 直接保存
      else {
        set({ activeEnvironment: environment });
        updateWorkspaceEnvironmentLS(get().activeWorkspaceId, environment.id);
      }
    },
  })),
);

type WorkspaceEnvironmentPair = { [workspaceId: string]: string };
const updateWorkspaceEnvironmentLS = (workspaceId: string, environmentId: string) => {
  let workspaceEnvironmentPair = getLocalStorage<WorkspaceEnvironmentPair>(
    WorkspaceEnvironmentPairKey,
  );
  if (!workspaceEnvironmentPair) {
    workspaceEnvironmentPair = { [workspaceId]: environmentId };
  } else if (workspaceEnvironmentPair[workspaceId] === environmentId) {
    return;
  } else {
    workspaceEnvironmentPair[workspaceId] = environmentId;
  }
  setLocalStorage(WorkspaceEnvironmentPairKey, workspaceEnvironmentPair);
};

// @ts-ignore
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('BaseStore', useStore);
}
