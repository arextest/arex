import { ColorPrimary, I18nextLng, setLocalStorage, Theme } from '@arextest/arex-core';
import { create } from 'zustand';

import { DEFAULT_COLOR_PRIMARY, DEFAULT_THEME, THEME_KEY } from '../constant';

export type UserProfileState = {
  theme: Theme;
  compact: boolean;
  colorPrimary: ColorPrimary;
  language: I18nextLng;
};

export type UserProfileAction = {
  setTheme: (theme: Theme) => void;
};

const initialState: UserProfileState = {
  theme: DEFAULT_THEME,
  compact: false,
  colorPrimary: DEFAULT_COLOR_PRIMARY,
  language: I18nextLng.cn,
};

const useUserProfile = create<UserProfileState & UserProfileAction>((set) => ({
  ...initialState,
  setTheme: (theme: Theme) => {
    setLocalStorage(THEME_KEY, theme);
    set({ theme });
  },
}));

export default useUserProfile;
