import { request } from '@/utils';

export async function getScheduleServiceVersion() {
  const res = await request.get<string>('/version/schedule');
  return res.body;
}
