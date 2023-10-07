import { ArexRESTRequest } from '@arextest/arex-request';

export function convertRequest(request: ArexRESTRequest) {
  if (request.inherited) {
    return {
      ...request,
      method: request.inheritedMethod,
      endpoint: request.inheritedEndpoint,
    };
  } else {
    return request;
  }
}
