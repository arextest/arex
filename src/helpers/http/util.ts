import { HoppRESTRequest } from '../../components/http/data/rest';
import { SaveInterfaceReq } from '../../services/FileSystem.type';
export function convertSaveRequestData(
  workspaceId: string,
  id: string,
  request: HoppRESTRequest,
): SaveInterfaceReq {
  return {
    id,
    body: request.body,
    headers: request.headers,
    workspaceId,
    params: request.params,
    preRequestScripts: request.preRequestScripts,
    testScripts: request.testScripts,
    address: {
      method: request.method,
      endpoint: request.endpoint,
    },
    testAddress: {
      method: request.compareMethod,
      endpoint: request.compareEndpoint,
    },
    description: request.description,
    inherited: request.inherited,
  };
}
