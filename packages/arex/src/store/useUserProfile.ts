import { getLocalStorage, i18n, I18nextLng, setLocalStorage, Theme } from '@arextest/arex-core';
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
  compact: true,
  colorPrimary: DEFAULT_COLOR_PRIMARY,
  language: I18nextLng.en,
  avatar: '',
};

const useUserProfile = create<UserProfile & UserProfileAction>((set) => {
  async function getUserProfile(email?: string) {
    const _email = email || getLocalStorage<string>(EMAIL_KEY);
    if (!_email) return;

    let profile: UserProfile | undefined;
    try {
      profile = await UserService.getUserProfile(_email);
    } catch (e: any) {
      // 由于后端没有过期的responseCode，所以单独在这里判断。
      if (e?.responseCode === 4) {
        window.message.error(i18n.t('loginInformationExpired'));
        globalStoreReset();
      } else {
        window.message.error(e);
      }
    }
    window.__locale__ = profile?.language || 'en';
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
