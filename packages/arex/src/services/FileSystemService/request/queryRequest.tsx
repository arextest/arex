import { ArexRESTRequest } from 'arex-request-core/dist/components/http/data/rest';

import { request } from '@/utils';

export async function queryRequest(params: {
  id: string;
  nodeType: number;
}): Promise<ArexRESTRequest & { recordId: string; inherited: boolean }> {
  if (params.nodeType === 1) {
    const res = await request.post<any>(`/report/filesystem/queryInterface`, params);
    const {
      body: { address, testAddress, ...rest },
    } = res;
    return {
      id: rest.id,
      name: rest.name,
      method: address?.method || 'GET',
      endpoint: address?.endpoint || '',
      headers: rest.headers || [],
      params: rest.params || [],
      body: rest.body || { contentType: 'application/json', body: '' },
      testScript: rest.testScripts?.length > 0 ? rest.testScripts[0].value : '',
      preRequestScript: rest.preRequestScript?.length > 0 ? rest.preRequestScript[0].value : '',
      recordId: rest.recordId,
      inherited: undefined,
      inheritedMethod: '',
      inheritedEndpoint: '',
      tags: rest.labelIds || [],
      description: rest.description,
    };
  } else {
    const res = await request.post<any>(`/report/filesystem/queryCase`, params);
    const {
      body: { address, testAddress, ...rest },
    } = res;
    // @ts-ignore
    return {
      id: rest.id,
      method: address?.method || 'GET',
      endpoint: address?.endpoint || '',
      headers: rest.headers || [],
      params: rest.params || [],
      body: rest.body || { contentType: 'application/json', body: '' },
      testScript: rest.testScripts?.length > 0 ? rest.testScripts[0].value : '',
      preRequestScript: rest.preRequestScript?.length > 0 ? rest.preRequestScript[0].value : '',
      recordId: rest.recordId,
      inherited: undefined,
      inheritedMethod: 'GET',
      inheritedEndpoint: '',
      tags: rest.labelIds || [],
      description: rest.description,
    };
  }
}
