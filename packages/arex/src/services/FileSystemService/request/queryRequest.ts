import type { ArexRESTRequest } from '@arextest/arex-request';

import { CollectionNodeType } from '@/constant';
import { queryDebuggingCase } from '@/services/FileSystemService';
import { request } from '@/utils';

export type ArexRequest = ArexRESTRequest & {
  recordId: string;
  inherited: boolean;
  nodeType: CollectionNodeType;
  tags: string[];
  parentPath: { id: string; name: string; nodeType: CollectionNodeType }[];
};

export async function queryRequest(params: {
  id: string;
  nodeType: CollectionNodeType;
  recordId?: string;
  planId?: string;
}): Promise<ArexRequest> {
  const res = await request.post<any>(
    `/webApi/filesystem/query${
      params.nodeType === CollectionNodeType.interface ? 'Interface' : 'Case'
    }`,
    params,
  );
  if (params.id.length !== 24) {
    // 如果有recordId是从调试页面进来的
    if (params.recordId) {
      const res = await queryDebuggingCase({
        recordId: params.recordId,
        planId: params.planId,
      });
      if (!res.body) return Promise.reject(res.responseStatusType.responseDesc);

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
        nodeType: params.nodeType,
        tags: rest.labelIds || [],
        description: rest.description,
        parentPath: rest?.parentPath,
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
      nodeType: params.nodeType,
      tags: [],
      description: '',
      parentPath: [],
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
    nodeType: params.nodeType,
    tags: rest.labelIds || [],
    description: rest.description,
    parentPath: rest?.parentPath,
  };
}
