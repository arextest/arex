import { ColorPrimary, CompactMode, I18nextLng, tryParseJsonString } from '@arextest/arex-core';

import { Theme } from '@/constant';
import { request } from '@/utils';

export type UserProfile = {
  theme: Theme;
  compact: CompactMode;
  colorPrimary: ColorPrimary;
  language: I18nextLng;
  zen?: boolean;
  avatar?: string;
};

export async function getUserProfile(email: string) {
  const res = await request.get<{ profile: string }>(`/webApi/login/userProfile/${email}`);
  return tryParseJsonString<UserProfile>(res.body.profile);
}
