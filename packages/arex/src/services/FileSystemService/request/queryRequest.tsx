import { ArexRESTRequest } from 'arex-request-core/dist/components/http/data/rest';

import { queryDebuggingCase } from '@/services/FileSystemService';
import { request } from '@/utils';

export async function queryRequest(params: {
  id: string;
  nodeType: number;
  recordId: string | undefined;
  planId: string | undefined;
}): Promise<ArexRESTRequest & { recordId: string; inherited: boolean }> {
  const res = await request.post<any>(
    `/report/filesystem/query${params.nodeType === 1 ? 'Interface' : 'Case'}`,
    params,
  );
  if (params.id.length !== 24) {
    // 如果有recordId是从调试页面进来的
    if (params.recordId && params.planId) {
      const res = await queryDebuggingCase({ recordId: params.recordId,planId:params.planId }).then((res) => res);
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
        preRequestScript: rest.preRequestScripts?.length > 0 ? rest.preRequestScripts[0].value : '',
        recordId: rest.recordId,
        // @ts-ignore
        inherited: undefined,
        inheritedMethod: '',
        inheritedEndpoint: '',
        tags: rest.labelIds || [],
        description: rest.description,
      };
    }
    // 如果没有recordId是新增页面进来的
    return {
      id: params.id,
      name: '',
      method: 'GET',
      endpoint: '',
      headers: [],
      params: [],
      body: { contentType: 'application/json', body: '' },
      testScript: '',
      preRequestScript: '',
      // @ts-ignore
      recordId: null,
      // @ts-ignore
      inherited: undefined,
      inheritedMethod: '',
      inheritedEndpoint: '',
      tags: [],
      description: '',
    };
  }
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
    preRequestScript: rest.preRequestScripts?.length > 0 ? rest.preRequestScripts[0].value : '',
    recordId: rest.recordId,
    // @ts-ignore
    inherited: undefined,
    inheritedMethod: '',
    inheritedEndpoint: '',
    tags: rest.labelIds || [],
    description: rest.description,
  };
}
