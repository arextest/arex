import { getLocalStorage, i18n, I18nextLng, setLocalStorage, Theme } from '@arextest/arex-core';
import * as Sentry from '@sentry/react';
import { create } from 'zustand';

import { DEFAULT_COLOR_PRIMARY, DEFAULT_THEME, EMAIL_KEY, THEME_KEY } from '@/constant';
import { UserService } from '@/services';
import { UserProfile } from '@/services/UserService';
import globalStoreReset from '@/utils/globalStoreReset';

export type UserProfileAction = {
  setTheme: (theme: Theme) => void;
  getUserProfile: () => void;
  reset: () => void;
};

const initialState: UserProfile = {
  theme: DEFAULT_THEME,
  compact: false,
  colorPrimary: DEFAULT_COLOR_PRIMARY,
  language: I18nextLng.cn,
  avatar: '',
};

const useUserProfile = create<UserProfile & UserProfileAction>((set) => {
  async function getUserProfile(email?: string) {
    const _email = email || getLocalStorage<string>(EMAIL_KEY);
    if (!_email) return;

    let profile: UserProfile | undefined;
    try {
      profile = await UserService.getUserProfile(_email);
      Sentry.setTag('arex-user', email);
    } catch (e) {
      window.message.error(i18n.t('loginInformationExpired'));
      globalStoreReset();
    }

    profile && set(profile);
  }

  return {
    ...initialState,
    setTheme: (theme: Theme) => {
      setLocalStorage(THEME_KEY, theme);
      set({ theme });
    },
    getUserProfile,
    reset: () => set(initialState),
  };
});

export default useUserProfile;
