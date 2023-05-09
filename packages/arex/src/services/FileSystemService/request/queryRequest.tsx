// import { RequestMethod } from 'arex-core';
import { HoppRESTRequest } from 'arex-request-core/dist/components/http/data/rest';

import { request } from '@/utils';

export async function queryRequest(params: {
  id: string;
  nodeType: number;
}): Promise<HoppRESTRequest> {
  if (params.nodeType === 1) {
    const res = await request.post<any>(`/report/filesystem/queryInterface`, params);
    const {
      body: { address, testAddress, ...rest },
    } = res;
    // @ts-ignore
    return {
      id: rest.id,
      method: address?.method,
      endpoint: address?.endpoint,
      headers: rest.headers,
      params: rest.params || [],
      body: rest.body,
      testScript: rest.testScripts?.length > 0 ? rest.testScripts[0].value : '',
      preRequestScript: rest.preRequestScript?.length > 0 ? rest.preRequestScript[0].value : '',
    };
  } else {
    const res = await request.post<any>(`/report/filesystem/queryCase`, params);
    const {
      body: { address, testAddress, ...rest },
    } = res;
    // @ts-ignore
    return {
      id: rest.id,
      method: address?.method,
      endpoint: address?.endpoint,
      headers: rest.headers,
      params: rest.params || [],
      body: rest.body,
      testScript: rest.testScripts?.length > 0 ? rest.testScripts[0].value : '',
      preRequestScript: rest.preRequestScript?.length > 0 ? rest.preRequestScript[0].value : '',
    };
  }
}
