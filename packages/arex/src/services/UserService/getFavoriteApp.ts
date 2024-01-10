import { request } from '@/utils';

export type UserFavoriteAppRes = {
  userName: string;
  favoriteApps: string[];
};

export async function getFavoriteApp(email: string) {
  const res = await request.get<UserFavoriteAppRes>(`/webApi/login/userFavoriteApp/${email}`);
  return res.body?.favoriteApps ?? [];
}
