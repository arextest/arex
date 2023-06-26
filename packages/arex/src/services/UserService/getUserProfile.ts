import {
  ColorPrimary,
  CompactMode,
  I18nextLng,
  Theme,
  tryParseJsonString,
} from '@arextest/arex-core';

import { request } from '@/utils';

export type UserProfile = {
  theme: Theme;
  compact: CompactMode;
  colorPrimary: ColorPrimary;
  language: I18nextLng;
  avatar?: string;
};

export async function getUserProfile(email: string) {
  const res = await request.get<{ profile: string }>(`/report/login/userProfile/${email}`);
  return tryParseJsonString<UserProfile>(res.body.profile);
}
