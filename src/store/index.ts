import { toggleTheme } from "@zougt/vite-plugin-theme-preprocessor/dist/browser-utils";
import create from "zustand";

import { DefaultTheme, Theme } from "../style/theme";

interface BaseState {
  theme: Theme;
  changeTheme: (theme?: Theme) => void;
  userinfo: any;
  setUserinfo: (a: any) => void;
  workspaces: any;
  setWorkspaces: (a: any) => void;
  currentWorkspaceId: any;
  setCurrentWorkspaceId: (a: any) => void;
}
export const useStore = create<BaseState>((set, get) => ({
  theme: DefaultTheme,
  changeTheme: (theme?: Theme) => {
    set((state) => {
      const newTheme =
        theme || (state.theme === Theme.light ? Theme.dark : Theme.light);
      toggleTheme({
        scopeName: newTheme,
      });
      localStorage.setItem("theme", newTheme);
      return {
        theme: newTheme,
      };
    });
  },
  userinfo: {},
  setUserinfo: (a: any) => {
    console.log(a);
    return set(() => ({ userinfo: a }));
  },
  currentWorkspaceId: "",
  setCurrentWorkspaceId: (currentWorkspaceId: any) => {
    return set(() => ({ currentWorkspaceId }));
  },
  workspaces: [],
  setWorkspaces: (workspaces: any) => {
    return set(() => ({ workspaces }));
  },
}));
