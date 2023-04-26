import { request } from '../../utils';
import { FavoriteAppReq } from './setFavoriteApp';

export async function setUnFavoriteApp(params: FavoriteAppReq) {
  const res = await request.post<boolean>(`/report/login/userFavoriteApp/modify/REMOVE`, params);
  return res.body;
}
