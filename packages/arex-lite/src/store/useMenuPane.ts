import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { MenusType } from '../enums/menus';

// 不同 MenuItem 组件传递的完整数据类型, 后续不断扩充
export type PageData = undefined;

export type Page<D extends PageData = undefined> = {
  title: string;
  key?: string;
  menuType?: MenusType;
  pageType: string;
  isNew?: boolean;
  data: D;
  sortIndex?: number;
  paneId: string;
  rawId: React.Key;
};

type ActiveMenu = [MenusType | undefined, string | undefined]; // [菜单id, 菜单项目id]
type SetPagesMode = 'push' | 'normal';
type BaseState = {
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
};

export const DefaultEnvironment = { envName: 'No Environment', id: '0' };

export const useStore = create(
  persist(
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
            pages:
              segment === 'left' ? pages.slice(index, pages.length) : pages.slice(0, index + 1),
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
    })),
    {
      name: 'menus-panes-storage', // unique name
    },
  ),
);
