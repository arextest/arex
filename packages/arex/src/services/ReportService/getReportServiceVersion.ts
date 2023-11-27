import { request } from '@/utils';

export async function getReportServiceVersion() {
  const res = await request.get<string>('/version/report');
  return res.body;
}
