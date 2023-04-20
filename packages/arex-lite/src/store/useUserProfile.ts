import { Theme } from 'arex-core';
import { create } from 'zustand';

export type UserProfileState = {
  theme: Theme;
};

export type UserProfileAction = {
  setTheme: (theme: Theme) => void;
};

const useUserProfile = create<UserProfileState & UserProfileAction>((set) => ({
  theme: Theme.light,
  setTheme: (theme: Theme) => set({ theme }),
}));

export default useUserProfile;
