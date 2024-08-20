import { getLocalStorage, i18n, setLocalStorage, transformPlatformKey } from '@arextest/arex-core';
import { create } from 'zustand';

import {
  DEFAULT_COLOR_PRIMARY,
  DEFAULT_COMPACT,
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  EMAIL_KEY,
  Theme,
  THEME_KEY,
} from '@/constant';
import { UserService } from '@/services';
import { UserProfile } from '@/services/UserService';
import { bindings } from '@/utils/keybindings';

export type UserProfileAction = {
  setTheme: (theme: Theme) => void;
  setZen: (zen?: boolean) => void;
  getUserProfile: () => void;
  reset: () => void;
};

const initialState: UserProfile = {
  theme: DEFAULT_THEME,
  compact: DEFAULT_COMPACT,
  colorPrimary: DEFAULT_COLOR_PRIMARY,
  language: DEFAULT_LANGUAGE,
  zen: false,
  avatar: '',
};

const ZenModeKeys = Object.keys(bindings)
  .find((key) => bindings[key as keyof typeof bindings] === 'general.zen')
  ?.split('-')
  .map(transformPlatformKey);
const useUserProfile = create<UserProfile & UserProfileAction>((set, get) => {
  async function getUserProfile(email?: string) {
    const _email = email || getLocalStorage<string>(EMAIL_KEY);
    if (!_email) return;

    const profile = await UserService.getUserProfile(_email);
    i18n.changeLanguage(profile?.language || 'en');
    window.__locale__ = profile?.language || 'en';
    profile && set(profile);
  }

  return {
    ...initialState,
    setTheme: (theme: Theme) => {
      setLocalStorage(THEME_KEY, theme);
      set({ theme });
    },
    setZen: (zen) => {
      if (zen === true || (zen === undefined && get().zen === false)) {
        window.message.info(
          i18n.t('general.exitZenTip', { ns: 'shortcuts', exitZenKeys: ZenModeKeys?.join('-') }),
        );
      }

      if (zen === undefined) set({ zen: !get().zen });
      else set({ zen });
    },
    getUserProfile,
    reset: () => set(initialState),
  };
});

export default useUserProfile;
