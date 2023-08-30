import { request } from '@/utils';

export async function queryDebuggingCase(params: { recordId: string }) {
  return request
    .get<any>(`/report/filesystem/queryDebuggingCase/${params.recordId}`)
    .then((res) => res);
}
