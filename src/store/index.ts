// @ts-ignore
import { toggleTheme } from '@zougt/vite-plugin-theme-preprocessor/dist/browser-utils';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { PaneType } from '../layouts/MainBox';
import { DefaultTheme, Theme, ThemeKey } from '../style/theme';
import { getLocalStorage, setLocalStorage } from '../utils';

type UserInfo = {
  email: string | null;
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
  panes: PaneType[];
  setPanes: (panes: PaneType | PaneType[], mode?: 'push') => void;

  collectionTreeData: any;
  setCollectionTreeData: (collectionTreeData: any) => void;
};

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

    activePane: getLocalStorage('activePane') || [],
    setActivePane: (key: string) => {
      set({ activePane: key });
      setLocalStorage('activePane', key);
    },
    panes: getLocalStorage('panes') || [],
    setPanes: (panes, mode) => {
      if (!mode) {
        set({ panes: panes as PaneType[] });
        setLocalStorage('panes', panes);
      }

      if (mode === 'push') {
        // immer update
        set((state) => {
          state.panes.push(panes as PaneType);
          setLocalStorage('panes', [...state.panes, panes]);
        });
      }
    },

    collectionTreeData: [],
    setCollectionTreeData: (collectionTreeData) => set({ collectionTreeData }),
  })),
);
