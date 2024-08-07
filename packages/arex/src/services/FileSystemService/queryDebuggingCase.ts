import { request } from '@/utils';

export async function queryDebuggingCase(params: {
  recordId: string;
  planId?: string;
}): Promise<any> {
  return request.get<any>(
    `/webApi/filesystem/queryDebuggingCase/${params.planId}/${params.recordId}`,
  );
}
