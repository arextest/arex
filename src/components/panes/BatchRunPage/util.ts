import { runRESTRequest } from '../../../helpers/http/RequestRunner';
import { FileSystemService } from '../../../services/FileSystem.service';
import { urlPretreatment } from '../../http/helpers/utils/util';

export const getBatchTestResults = async (
  caseIds: string[],
  envs: { key: string; value: string }[],
): Promise<
  {
    caseRequest: {
      method: string;
      endpoint: string;
      compareMethod: string;
      compareEndpoint: string;
    };
    testResult: any;
  }[]
> => {
  const results = [];
  for (let i = 0; i < caseIds.length; i++) {
    try {
      const caseId = caseIds[i];
      const caseRequest = await FileSystemService.queryCase({ id: caseId });
      const {
        endpoint,
        method,
        compareEndpoint,
        compareMethod,
        testScripts,
        headers,
        params,
        body,
      } = caseRequest;

      const testResult = await runRESTRequest({
        description: '',
        endpoint: urlPretreatment(endpoint, envs),
        inherited: true,
        auth: null,
        name: '',
        preRequestScripts: [],
        parentPreRequestScripts: [],
        compareEndpoint: urlPretreatment(compareEndpoint, envs),
        compareMethod: compareMethod,
        method: method,
        testScripts: testScripts,
        params: params,
        headers: headers,
        body: body,
      });
      results.push({
        caseRequest,
        testResult,
      });
    } catch (e) {
      console.log(e);
    }
  }

  return results;
};

export async function getAllRequestsData(requestIds: string[]) {
  const result = [];
  for (let i = 0; i < requestIds.length; i++) {
    const requestRes = await FileSystemService.queryInterface({ id: requestIds[i] });

    result.push(requestRes);
  }
  return result;
}
