import { request } from '@/utils';

export type AddItemFromRecordReq = {
  workspaceId: string;
  parentPath: string[];
  nodeName: string;
  planId: string;
  recordId: string;
  operationId: string;
  userName?: string;
};

export async function addItemFromRecord(params: AddItemFromRecordReq) {
  return request
    .post<{ success: boolean }>('/webApi/filesystem/addItemFromRecord', params)
    .then((res) => res.body);
}
