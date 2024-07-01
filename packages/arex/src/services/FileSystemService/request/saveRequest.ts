import type { ArexRESTRequest } from '@arextest/arex-request';

import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

export function convertRequestParams(
  params: ArexRESTRequest & { workspaceId: string; inherited?: boolean; tags: string[] },
) {
  return {
    address:
      params.method || params.endpoint
        ? {
            method: params.method,
            endpoint: params.endpoint,
          }
        : undefined,
    params: params.params,
    headers: params.headers,
    testScripts: [
      {
        type: '0',
        icon: null,
        label: 'CustomScript',
        value: params.testScript,
        disabled: false,
      },
    ],
    body: params.body,
    preRequestScripts: [
      {
        type: '0',
        icon: null,
        label: 'CustomScript',
        value: params.preRequestScript,
        disabled: false,
      },
    ],
    // id
    workspaceId: params.workspaceId,
    id: params.id,
    inherited: params.inherited,
    description: params.description,
    labelIds: params.tags,
  };
}

export async function saveRequest(
  workspaceId: string,
  params: ArexRESTRequest & { inherited?: boolean; tags: string[] },
  nodeType: number,
) {
  const saveParams = convertRequestParams({ ...params, workspaceId });
  const res = await request.post<{ success: boolean }>(
    `/webApi/filesystem/${
      nodeType === CollectionNodeType.interface ? 'saveInterface' : 'saveCase'
    }`,
    saveParams,
  );
  return res.body.success;
}
