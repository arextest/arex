import { request } from '@/utils';

export type Desensitization = {
  id: string;
  jarUrl: string;
  remark: string;
  uploadDate: string;
};

export async function listDesensitization() {
  const res = await request.get<Desensitization[]>('/report/desensitization/listJar');
  return res.body;
}
