import { CollectionNodeType } from '@/constant';
import { BaseInterface } from '@/services/FileSystemService';
import { request } from '@/utils';

export interface BatchGetInterfaceCaseReq {
  workspaceId: string;
  nodes: { infoId: string; nodeType: CollectionNodeType }[];
}

interface interfaceCaseNode extends BaseInterface {
  parentPath: { id: string; name: string; nodeType: CollectionNodeType }[];
}

export interface BatchGetInterfaceCaseRes {
  nodes: interfaceCaseNode[];
}

export async function batchGetInterfaceCase(params: BatchGetInterfaceCaseReq) {
  const res = await request.post<BatchGetInterfaceCaseRes>(
    '/webApi/filesystem/batchGetInterfaceCase',
    params,
  );
  return res.body.nodes.map((node) => {
    const { address, ...rest } = node;

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
      // nodeType: params.nodeType,
      tags: rest.labelIds || [],
      description: rest.description,
      parentPath: rest?.parentPath,
    };
  });
}
