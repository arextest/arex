import { getLocalStorage } from '@arextest/arex-core';
import axios from 'axios';

import { ACCESS_TOKEN_KEY } from '@/constant';
import { ResponseStatusType } from '@/utils/request';

export enum DeleteRecordType {
  'ByAppId' = 1,
  'ByAppIdAndOperationName' = 2,
  'ByRecord' = 3,
}

export interface DeleteRecordReq {
  appId: string;
  operationName?: string;
  recordId?: string;
  type: DeleteRecordType;
}
export async function deleteRecord(params: DeleteRecordReq): Promise<boolean> {
  const res = await axios.post<{ responseStatusType: ResponseStatusType }>(
    '/storage/storage/edit/removeBy/',
    params,
    {
      headers: {
        'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
        appId: params.appId,
      },
    },
  );

  return res.data.responseStatusType.responseCode === 0;
}
