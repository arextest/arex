import { RequestMethod } from '@arextest/arex-core';

import { request } from '@/utils';

export type Address = {
  method: (typeof RequestMethod)[number];
  endpoint: string;
};

export type KeyValueType = {
  key: string;
  value: string;
  active?: boolean;
};

export type BaseInterface = {
  id: string;
  name: string | null;
  address: Address;
  preRequestScripts: any;
  testScripts: any;
  body: { [key: string]: string };
  headers: KeyValueType[];
  params: KeyValueType[];
  auth: any;
  testAddress: Address;
  customTags: null;
  // interface unique attribute
  operationId?: string | null;
  operationResponse?: string | null;
  // case unique attribute
  recordId?: string | null;
  comparisonMsg?: null;
  labelIds?: string[];
  description?: string | null;
  inherited: boolean;
};

export async function queryInterface(params: { id: string }, infoId?: string) {
  const res = await request.post<BaseInterface>(`/webApi/filesystem/queryInterface`, params);
  const {
    body: { address, testAddress, ...rest },
  } = res;
  return {
    ...rest,
    method: address?.method,
    endpoint: address?.endpoint,
    compareMethod: testAddress?.method,
    compareEndpoint: testAddress?.endpoint,
    address,
    testAddress,
    headers: (rest.headers || []).sort((a, b) => {
      return -(a.key.includes('arex') ? 1 : -1) + (b.key.includes('arex') ? 1 : -1);
    }),
    params: rest.params || [],
  };
}
