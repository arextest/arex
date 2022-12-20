import { HoppRESTRequest } from '../../components/arex-request/data/rest';
import { SaveInterfaceReq } from '../../services/FileSystem.type';

export function convertRequestData(requestData: any, address: any): HoppRESTRequest {
  if (requestData.body) {
    return {
      method: requestData.body[address]?.method || 'GET',
      endpoint: requestData.body[address]?.endpoint || '',
      body: requestData.body.body || {
        body: '',
        contentType: 'application/json',
      },
      testScript: requestData.body.testScript || '',
      preRequestScript: requestData.body.preRequestScript || '',
      headers: requestData.body.headers || [],
      params: requestData.body.params || [],
      compareEndpoint: requestData.body?.testAddress?.endpoint || '',
      compareMethod: requestData.body?.testAddress?.method || 'GET',
      recordId: requestData.body?.recordId,
      labelIds: requestData.body?.labelIds || [],
      preRequestScripts: requestData.body?.preRequestScripts || [],
      testScripts: requestData.body?.testScripts || [],
    };
  } else {
    return {
      method: 'GET',
      endpoint: '',
      body: {
        body: '',
        contentType: 'application/json',
      },
      testScript: '',
      preRequestScript: '',
      headers: [],
      params: [],
      compareEndpoint: '',
      compareMethod: 'GET',
      recordId: '',
      labelIds: [],
      preRequestScripts: [],
      testScripts: [],
    };
  }
}

export function convertSaveRequestData(
  workspaceId: string,
  id: string,
  r: HoppRESTRequest,
): SaveInterfaceReq {
  return {
    id,
    body: r.body,
    headers: r.headers,
    workspaceId,
    params: r.params,
    preRequestScript: r.preRequestScript,
    preRequestScripts: r.preRequestScripts,
    testScript: r.testScript,
    testScripts: r.testScripts,
    address: {
      method: r.method,
      endpoint: r.endpoint,
    },
    testAddress: {
      method: r.compareMethod,
      endpoint: r.compareEndpoint,
    },
  };
}
