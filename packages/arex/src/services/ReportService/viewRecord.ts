import { getLocalStorage, tryParseJsonString } from '@arextest/arex-core';
import axios from 'axios';

import { ACCESS_TOKEN_KEY, APP_ID_KEY } from '@/constant';
import { useClientStore } from '@/store';

export interface CategoryType {
  name: string;
  entryPoint: boolean;
  skipComparison: boolean;
}

export interface Attribute {
  requestPath: string;
  catId: string;
  format: string;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  configBatchNo: string;
}

export interface TargetRequest {
  body: string;
  attributes: Attribute;
  type: string | null;
}

export interface TargetResponse {
  body: string;
  attributes?: Attribute;
  type: string | null;
}

export type RecordResult = {
  id: string;
  categoryType: CategoryType;
  replayId: string | any;
  recordId: string;
  appId: string;
  recordEnvironment: number;
  creationTime: number;
  targetRequest: TargetRequest;
  targetResponse: TargetResponse;
  operationName: string;
  recordVersion?: number | any;
};

export interface ViewRecordRes {
  recordResult: RecordResult[];
  desensitized: boolean;
}

export async function viewRecord(recordId: string) {
  const res = await axios.post<ViewRecordRes>(
    '/webApi/replay/query/viewRecord',
    {
      recordId,
      splitMergeRecord: true,
    },
    {
      headers: {
        'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
        appId: getLocalStorage<string>(APP_ID_KEY),
        org: useClientStore.getState().companyName,
      },
      transformResponse: (res) => tryParseJsonString(res),
    },
  );
  return Promise.resolve(res.data);
}
