import { request } from '@/utils';

export type AddItemFromRecordByDefaultReq = {
  workspaceId: string;
  appName: string;
  interfaceName: string;
  nodeName: string;
  planId: string;
  operationId: string;
  recordId: string;
};

export async function dddItemFromRecordByDefault(params: AddItemFromRecordByDefaultReq) {
  return request
    .post<{ success: boolean }>('/report/filesystem/addItemFromRecordByDefault', params)
    .then((res) => res.body);
}
