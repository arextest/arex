import { request } from '@/utils';

export async function deleteReport(planId: string) {
  const res = await request.get<boolean>('/webApi/report/delete/' + planId);
  return res.body;
}
