import { HoppRESTRequest } from 'arex-request-core/dist/components/http/data/rest';

import { request } from '@/utils';

export async function saveRequest(workspaceId: string, params: HoppRESTRequest, nodeType:number) {
  if (nodeType === 1) {
    const saveParams = {
      address: {
        method: params.method,
        endpoint: params.endpoint,
      },
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
      body:params.body,
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
      workspaceId: workspaceId,
      id: params.id,
    };
    const res = await request.post<{ success: boolean }>(
      `/report/filesystem/saveInterface`,
      saveParams,
    );
    return res.body.success;
  } else {
    const saveParams = {
      address: {
        method: params.method,
        endpoint: params.endpoint,
      },
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
      body:params.body,
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
      workspaceId: workspaceId,
      id: params.id,
    };
    const res = await request.post<{ success: boolean }>(`/report/filesystem/saveCase`, saveParams);
    return res.body.success;
  }
}
