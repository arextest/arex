import { ArexPaneManager, arrayMove, Pane, PanesData } from '@arextest/arex-core';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { AREX_OPEN_NEW_PANEL, DEFAULT_ACTIVE_MENU, MAX_PANES_COUNT } from '@/constant';

export type MenusPanesState = {
  collapsed: boolean;
  activeMenu?: string; // MenusType
  activePane?: Pane<PanesData>;
  panes: Pane<PanesData>[];
  paneMaxIndex: number; // 用于同步 panes 中 index 的最大值
  openKeyboardShortcut: boolean;
};

export type MenusPanesAction = {
  setCollapsed: (collapsed: boolean) => void;
  toggleOpenKeyboardShortcut: () => void;
  setActiveMenu: (menuKey?: string) => void;
  setActivePane: (paneKey?: string) => void;
  setPanes: <D extends PanesData = PanesData>(panes: Pane<D> | Pane<D>[]) => void;
  switchPane: (fromId: string, toId: string) => void;
  removePane: (paneKey: string) => void;
  removeSegmentPanes: (paneKey: string, segment: 'left' | 'right') => void;
  reset: () => void;
};

const initialState: MenusPanesState = {
  collapsed: false,
  activeMenu: DEFAULT_ACTIVE_MENU,
  activePane: undefined,
  panes: [],
  paneMaxIndex: 0,
  openKeyboardShortcut: false,
};

const Connector = '$&$';

export function encodePaneKey(pane?: Pane) {
  return pane && pane.type + Connector + pane.id;
}

export function decodePaneKey(paneKey?: string) {
  const [type, id] = paneKey?.split(Connector) || [];
  return { type, id };
}

// 注意：对 useMenusPanes 的订阅监听存在于 useInit hook 中
export const useMenusPanes = create(
  subscribeWithSelector(
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

        // 切换快捷键面板的显隐
        toggleOpenKeyboardShortcut: () => {
          set((state) => {
            state.openKeyboardShortcut = !state.openKeyboardShortcut;
          });
        },

        // 设置激活的面板
        setActivePane: (paneKey) => {
          set((state) => {
            const statePane = state.panes.find((i) => i.key === paneKey);
            if (statePane) {
              statePane.index = state.paneMaxIndex = state.paneMaxIndex + 1;
              state.activePane = statePane;
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
              activePane: latestPane,
              activeMenu: ArexPaneManager.getMenuTypeByType(latestPane?.type) || get().activeMenu, // 防止最后一个 pane 被关闭时 activeMenu 丢失
            });
          } else {
            // panes are single pane, insert
            set((state) => {
              const newPane = {
                ...panes,
                key: panes.key || encodePaneKey(panes),
                index: state.paneMaxIndex + 1,
              };
              state.activePane = newPane;
              state.paneMaxIndex = state.paneMaxIndex + 1;

              const menuType = ArexPaneManager.getMenuTypeByType(panes.type);
              menuType && (state.activeMenu = menuType);

              // return if pane already exists, update pane
              const index = state.panes.findIndex((i) => i.key === encodePaneKey(panes));
              if (index >= 0) {
                state.panes[index] = Object.assign(state.panes[index], newPane);
                return;
              }

              if (state.panes.length > MAX_PANES_COUNT) {
                state.panes.shift();
              }

              // dispatch event to open new pane
              const event = new CustomEvent(AREX_OPEN_NEW_PANEL, {
                detail: newPane,
              });
              window.dispatchEvent(event);

              // insert new pane with sortIndex
              state.panes.push(newPane);
            });
          }
        },

        // 交换两个面板的位置
        switchPane: (fromId, toId) => {
          const panes = get().panes;
          const fromIndex = panes!.findIndex((i) => i.key === fromId);
          const toIndex = panes!.findIndex((i) => i.key === toId);
          get().setPanes(arrayMove(get().panes, fromIndex, toIndex));
        },

        // 关闭面板
        removePane(paneKey) {
          const panes = get().panes;
          const filteredPanes = panes.filter((i) => i.key !== paneKey);
          get().setPanes(filteredPanes);
        },

        // 关闭左侧或右侧的面板
        removeSegmentPanes: (paneKey, segment) => {
          const panes = get().panes;
          const index = panes.findIndex((pane) => pane.key === paneKey);
          if (Number.isInteger(index)) {
            set({
              panes:
                segment === 'left' ? panes.slice(index, panes.length) : panes.slice(0, index + 1),
            });
            get().setActivePane(paneKey);
          }
        },

        // 重置菜单和面板
        reset: () => {
          set({
            activePane: initialState.activePane,
            panes: initialState.panes,
            paneMaxIndex: initialState.paneMaxIndex,
          });
        },
      })),
      {
        name: 'menus-panes-storage', // unique name
      },
    ),
  ),
);

export default useMenusPanes;
