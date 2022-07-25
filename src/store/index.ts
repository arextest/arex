// @ts-ignore
import { toggleTheme } from "@zougt/vite-plugin-theme-preprocessor/dist/browser-utils";
import create from "zustand";

import { DefaultTheme, Theme } from "../style/theme";

interface BaseState {
  theme: Theme;
  changeTheme: (theme?: Theme) => void;
  extensionInstalled: boolean;
}

export const useStore = create<BaseState>(
  (set, get) => ({
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
    extensionInstalled: false,
  }),
);
