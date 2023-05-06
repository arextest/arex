import { I18nextLng, setLocalStorage, Theme } from 'arex-core';
import { create } from 'zustand';

import { DEFAULT_COLOR_PRIMARY, DEFAULT_THEME, THEME_KEY } from '@/constant';
import { UserProfile } from '@/services/UserService';

export type UserProfileAction = {
  setTheme: (theme: Theme) => void;
  setUserProfile: (profile: UserProfile) => void;
};

const initialState: UserProfile = {
  theme: DEFAULT_THEME,
  compact: false,
  colorPrimary: DEFAULT_COLOR_PRIMARY,
  language: I18nextLng.cn,
  avatar: '',
};

const useUserProfile = create<UserProfile & UserProfileAction>((set) => ({
  ...initialState,
  setTheme: (theme: Theme) => {
    setLocalStorage(THEME_KEY, theme);
    set({ theme });
  },
  setUserProfile: (profile: UserProfile) => {
    set(profile);
  },
}));

export default useUserProfile;
