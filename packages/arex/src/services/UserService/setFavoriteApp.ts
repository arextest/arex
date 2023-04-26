import { request } from '../../utils';

export type FavoriteAppReq = {
  userName: string;
  favoriteApp: string;
};

export async function setFavoriteApp(params: FavoriteAppReq) {
  const res = await request.post<boolean>(`/report/login/userFavoriteApp/modify/INSERT`, params);
  return res.body;
}
