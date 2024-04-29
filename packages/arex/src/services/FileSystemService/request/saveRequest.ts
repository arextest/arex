import type { ArexRESTRequest } from '@arextest/arex-request';

import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

export async function saveRequest(
  workspaceId: string,
  params: Partial<ArexRESTRequest & { inherited: boolean; tags: string[] }>,
  nodeType: number,
) {
  const saveParams = {
    address:
      params.method || params.endpoint
        ? {
            method: params.method,
            endpoint: params.endpoint,
          }
        : undefined,
    params: params.params,
    headers: params.headers,
    testScripts: params.testScript
      ? [
          {
            type: '0',
            icon: null,
            label: 'CustomScript',
            value: params.testScript,
            disabled: false,
          },
        ]
      : undefined,
    body: params.body,
    preRequestScripts: params.preRequestScript
      ? [
          {
            type: '0',
            icon: null,
            label: 'CustomScript',
            value: params.preRequestScript,
            disabled: false,
          },
        ]
      : undefined,
    // id
    workspaceId: workspaceId,
    id: params.id,
    inherited: params.inherited,
    description: params.description,
    labelIds: params.tags,
  };
  const res = await request.post<{ success: boolean }>(
    `/webApi/filesystem/${
      nodeType === CollectionNodeType.interface ? 'saveInterface' : 'saveCase'
    }`,
    saveParams,
  );
  return res.body.success;
}
