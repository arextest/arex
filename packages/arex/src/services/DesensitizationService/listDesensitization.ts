import { request } from '@/utils';

export type Desensitization = {
  id: string;
  jarUrl: string;
  remark: string;
  uploadDate: string;
};

export async function listDesensitization() {
  const res = await request.post<Desensitization[]>('/webApi/desensitization/listJar');
  return res.body?.[0]; // 目前全局只有一个脱敏jar，所以只取第一个，保留 array 数据结构为后续扩展做准备
}
