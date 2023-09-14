import { ArexMenuManager, ArexPaneManager, arrayMove, Pane, PanesData } from '@arextest/arex-core';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { AREX_OPEN_NEW_PANEL, DEFAULT_ACTIVE_MENU, MAX_PANES_COUNT } from '@/constant';

export type MenusPanesState = {
  menuCollapsed: boolean;
  activeMenu?: string; // MenusType
  activePane?: Pane<PanesData>;
  panes: Pane<PanesData>[];
  paneMaxIndex: number; // 用于同步 panes 中 index 的最大值
  openKeyboardShortcut: boolean;
};

export type MenusPanesAction = {
  toggleMenuCollapse: (collapsed?: boolean) => void;
  toggleOpenKeyboardShortcut: () => void;
  setActiveMenu: (menuKey: string | undefined, options?: { offset?: 'top' | 'bottom' }) => void;
  setActivePane: (paneKey: string | undefined, options?: { offset?: 'left' | 'right' }) => void;
  setPanes: <D extends PanesData = PanesData>(panes: Pane<D> | Pane<D>[]) => void;
  switchPane: (fromId: string, toId: string) => void;
  removePane: (paneKey: string | undefined, options?: { reversal?: boolean }) => void;
  removeSegmentPanes: (paneKey: string, segment: 'left' | 'right') => void;
  reset: () => void;
};

const initialState: MenusPanesState = {
  menuCollapsed: false,
  activeMenu: DEFAULT_ACTIVE_MENU,
  activePane: undefined,
  panes: [],
  paneMaxIndex: 0,
  openKeyboardShortcut: false,
};

const Connector = '-_-';

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
        toggleMenuCollapse: (collapsed) => {
          set((state) => {
            state.menuCollapsed =
              typeof collapsed === 'undefined' ? !state.menuCollapsed : collapsed;
          });
        },

        // 设置激活的菜单
        setActiveMenu: (menuType, options) => {
          let key = menuType || get().activeMenu;
          if (!key) return;
          const { offset } = options || {};
          const arexMenus = ArexMenuManager.getMenus();

          if (offset) {
            let index = arexMenus.findIndex((item) => item.type === key);
            if (offset === 'top') {
              if (index === 0) index = arexMenus.length;
              index--;
            } else if (offset === 'bottom') {
              if (index === arexMenus.length - 1) index = -1;
              index++;
            }
            key = arexMenus[index].type;
          }

          set((state) => {
            state.activeMenu = key;
          });
        },

        // 切换快捷键面板的显隐
        toggleOpenKeyboardShortcut: () => {
          set((state) => {
            state.openKeyboardShortcut = !state.openKeyboardShortcut;
          });
        },

        // 设置激活的面板
        setActivePane: (paneKey, options) => {
          const key = paneKey || get().activePane?.key;
          if (!key) return;
          const { offset } = options || {};

          set((state) => {
            let index = state.panes.findIndex((i) => i.key === key);
            if (index >= 0) {
              if (offset === 'left') {
                if (index === 0) index = state.panes.length;
                index--;
              } else if (offset === 'right') {
                if (index === state.panes.length - 1) index = -1;
                index++;
              }
              state.panes[index].index = state.paneMaxIndex = state.paneMaxIndex + 1;
              state.activePane = state.panes[index];
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

        // 关闭面板，默认关闭当前激活面板
        removePane(paneKey, options) {
          const key = paneKey || get().activePane?.key;
          if (!key) return;

          const { reversal } = options || {};
          const panes = get().panes;

          const filteredPanes = reversal
            ? [get().activePane as Pane]
            : panes.filter((i) => i.key !== key);
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
