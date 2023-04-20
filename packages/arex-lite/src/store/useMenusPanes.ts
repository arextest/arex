import { ArexPaneManager } from 'arex-core';
import { PanesData } from 'arex-core/src';
import { ReactNode } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { DEFAULT_ACTIVE_MENU, MAX_PANES_COUNT } from '../constant';

// 不同 MenuItem 组件传递的完整数据类型, 后续不断扩充
export type Pane<D extends PanesData = PanesData> = {
  id: string; //
  type: string; // PaneType
  key?: string; // unique, generate by id and type
  title: string;
  icon?: ReactNode;
  index?: number; // 越新的 pane, index 越大
  dirty?: boolean;
  data: D;
};

export type MenusPanesState = {
  collapsed: boolean;
  activeMenu?: string; // MenusType
  activePane?: string; // PaneKey
  panes: Pane<PanesData>[];
  paneMaxIndex: number; // 用于同步 panes 中 index 的最大值
};

export type MenusPanesAction = {
  setCollapsed: (collapsed: boolean) => void;
  setActiveMenu: (menuKey: string) => void;
  setActivePane: (paneKey: string) => void;
  setPanes: <D extends PanesData = PanesData>(panes: Pane<D> | Pane<D>[]) => void;
  removePane: (paneKey: string) => void;
  removeSegmentPages: (paneKey: string, segment: 'left' | 'right') => void;
  reset: () => void;
};

const initialState: MenusPanesState = {
  collapsed: false,
  activeMenu: DEFAULT_ACTIVE_MENU,
  activePane: undefined,
  panes: [],
  paneMaxIndex: 0,
};

function getPaneKey(pane?: Pane) {
  return pane && `${pane.id}_${pane.type}`;
}

export const useMenusPanes = create(
  persist(
    immer<MenusPanesState & MenusPanesAction>((set, get) => ({
      ...initialState,

      // 设置菜单折叠
      setCollapsed: (collapsed) => {
        set((state) => {
          state.collapsed = collapsed;
        });
      },

      // 设置激活的菜单
      setActiveMenu: (menuType) => {
        set((state) => {
          state.activeMenu = menuType;
        });
      },

      // 设置激活的面板
      setActivePane: (paneKey) => {
        set((state) => {
          const statePane = state.panes.find((i) => i.key === paneKey);
          if (statePane) {
            statePane.index = state.paneMaxIndex = state.paneMaxIndex + 1;
            state.activePane = paneKey;
          }
        });
      },

      // 新增面板
      setPanes: (panes) => {
        if (Array.isArray(panes)) {
          // panes are array, replace all panes
          const latestPane = panes.reduce((pane, cur) => {
            if ((cur.index || 0) > (pane.index || 0)) pane = cur;
            return pane;
          }, panes[0]);

          set({
            panes,
            activePane: latestPane?.key,
            activeMenu: ArexPaneManager.getMenuTypeByType(latestPane?.type),
          });
        } else {
          // panes are single pane, insert
          set((state) => {
            state.paneMaxIndex = state.paneMaxIndex + 1;
            state.activePane = getPaneKey(panes);
            // return if pane already exists
            if (state.panes.find((i) => i.key === getPaneKey(panes))) return;
            if (state.panes.length > MAX_PANES_COUNT) {
              state.panes.shift();
            }
            // insert new page with sortIndex
            state.panes.push({
              ...panes,
              key: getPaneKey(panes),
              index: state.paneMaxIndex + 1,
            });

            state.activeMenu = ArexPaneManager.getMenuTypeByType(panes.type);
          });
        }
      },

      // 关闭面板
      removePane(paneKey) {
        console.log('removePane', paneKey);
        const panes = get().panes;
        // const paneKey = getPaneKey(panes.find((i) => i.id === paneId));
        const filteredPanes = panes.filter((i) => i.key !== paneKey);
        get().setPanes(filteredPanes);
      },

      // 关闭左侧或右侧的面板
      removeSegmentPages: (paneId, segment) => {
        const panes = get().panes;
        const paneKey = getPaneKey(panes.find((i) => i.id === paneId));

        const index = panes.findIndex((page) => page.key === paneKey);
        Number.isInteger(index) &&
          set({
            panes:
              segment === 'left' ? panes.slice(index, panes.length) : panes.slice(0, index + 1),
          });
      },

      // 重置菜单和面板
      reset: () => {
        set(initialState);
      },
    })),
    {
      name: 'menus-panes-storage', // unique name
    },
  ),
);

export default useMenusPanes;
