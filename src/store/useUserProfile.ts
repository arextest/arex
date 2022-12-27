import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { UserProfileKey } from '../constant';
import defaultConfig from '../defaultConfig';
import { getLocalStorage, setLocalStorage } from '../helpers/utils';
import { I18nextLng } from '../i18n';
import { ColorPrimary, CompactMode, DarkMode, Theme } from '../theme';

export type UserProfile = {
  colorPrimary: ColorPrimary;
  darkMode: DarkMode;
  compactMode: CompactMode;
  language: I18nextLng;
};

export type State = UserProfile & {
  theme: Theme;
};

export type Action = {
  setUserProfile: (userProfile: UserProfile) => void;
};

const initialState: State = (() => {
  const userProfileLS = getLocalStorage<UserProfile>(UserProfileKey);

  return userProfileLS
    ? { ...userProfileLS, theme: userProfileLS.darkMode ? Theme.dark : Theme.light }
    : {
        colorPrimary: defaultConfig.colorPrimary,
        darkMode: defaultConfig.darkMode,
        compactMode: defaultConfig.compactMode,
        language: defaultConfig.language,
        theme: defaultConfig.darkMode ? Theme.dark : Theme.light,
      };
})();

const useUserProfile = create(
  immer<State & Action>((set) => ({
    ...initialState,
    setUserProfile(userProfile) {
      set(userProfile);
      setLocalStorage(UserProfileKey, userProfile);
      if (userProfile.darkMode !== undefined)
        set({
          theme: userProfile.darkMode ? Theme.dark : Theme.light,
        });
    },
  })),
);

export default useUserProfile;

// @ts-ignore
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('UserProfile', useUserProfile);
}
