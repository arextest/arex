import { KeyValueType } from '../../pages/HttpRequestPage';
import { SaveInterfaceReq } from '../../services/FileSystem.type';
import { HoppRESTRequest } from '../arex-request/data/rest';

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
      recordId: requestData.body?.recordId,
    };
  }
}

export function convertSaveRequestData(id: string, r: HoppRESTRequest): SaveInterfaceReq {
  return {
    id,
    body: r.body,
    headers: r.headers,
    id,
    params: r.params,
    preRequestScript: r.preRequestScript,
    testScript: r.testScript,
    address: {
      method: r.method,
      endpoint: r.endpoint,
    },
  };
}
