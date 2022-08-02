// @ts-ignore
import { toggleTheme } from '@zougt/vite-plugin-theme-preprocessor/dist/browser-utils';
import create from 'zustand';

import { DefaultTheme, Theme, ThemeKey } from '../style/theme';

type UserInfo = {
  email: string | null;
};

type BaseState = {
  theme: Theme;
  changeTheme: (theme?: Theme) => void;
  extensionInstalled: boolean;
  userInfo?: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  collectionTreeData: any
  setCollectionTreeData: (collectionTreeData: any) => void;
};

export const useStore = create<BaseState>((set, get) => ({
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
  collectionTreeData: [],
  setCollectionTreeData: (collectionTreeData) => set({ collectionTreeData }),
}));
