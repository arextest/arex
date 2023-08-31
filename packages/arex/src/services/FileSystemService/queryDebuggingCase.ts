import { request } from '@/utils';

export async function queryDebuggingCase(params: { recordId: string; planId: string }) {
  return request
    .get<any>(`/report/filesystem/queryDebuggingCase/${params.planId}/${params.recordId}`)
    .then((res) => res);
}
