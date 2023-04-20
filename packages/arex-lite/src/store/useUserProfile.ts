import { setLocalStorage, Theme } from 'arex-core';
import { create } from 'zustand';

import { DEFAULT_THEME, THEME_KEY } from '../constant';

export type UserProfileState = {
  theme: Theme;
};

export type UserProfileAction = {
  setTheme: (theme: Theme) => void;
};

const useUserProfile = create<UserProfileState & UserProfileAction>((set) => ({
  theme: DEFAULT_THEME,
  setTheme: (theme: Theme) => {
    setLocalStorage(THEME_KEY, theme);
    set({ theme });
  },
}));

export default useUserProfile;
