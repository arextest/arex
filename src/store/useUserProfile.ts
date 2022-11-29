import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import defaultConfig from '../defaultConfig';
import { I18nextLng } from '../i18n';
import { CompactMode, DarkMode, PrimaryColor, Theme } from '../style/theme';

export type UserProfile = {
  primaryColor: PrimaryColor;
  darkMode: DarkMode;
  compactMode: CompactMode;
  language: I18nextLng;
};

export type State = UserProfile & {
  theme: Theme;
};

export type Action = {
  changeTheme: (
    option: Pick<UserProfile, 'primaryColor' | 'darkMode' | 'compactMode'>
  ) => void;
};

const initialState: State = {
  primaryColor: defaultConfig.primaryColor,
  darkMode: defaultConfig.darkMode,
  compactMode: defaultConfig.compactMode,
  language: defaultConfig.language,
  theme: defaultConfig.darkMode ? Theme.dark : Theme.light,
};

const useUserProfile = create(
  immer<State & Action>((set, get) => ({
    ...initialState,
    changeTheme(option) {
      set(option);
      if (option.darkMode !== undefined)
        set({
          theme: option.darkMode ? Theme.dark : Theme.light,
        });
    },
  }))
);

export default useUserProfile;

// @ts-ignore
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('UserProfile', useUserProfile);
}
