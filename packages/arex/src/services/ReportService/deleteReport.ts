import { request } from '../../utils';

export async function deleteReport(planId: string) {
  const res = await request.get<boolean>('/report/report/delete/' + planId);
  return res.body;
}
