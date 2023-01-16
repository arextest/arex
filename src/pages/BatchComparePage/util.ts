import { urlPretreatment } from '../../components/arex-request/helpers/utils/util';
import axios from '../../helpers/api/axios';
import { treeFindPath } from '../../helpers/collection/util';
import { runCompareRESTRequest } from '../../helpers/CompareRequestRunner';
import { FileSystemService } from '../../services/FileSystem.service';

export const getBatchCompareResults = async (
  caseIds: string[],
  envs: { key: string; value: string }[],
  collectionTreeData: any,
): Promise<
  {
    caseRequest: {
      method: string;
      endpoint: string;
      compareMethod: string;
      compareEndpoint: string;
    };
    compareResult: {
      responses: [any, any];
    };
    caseCompare: any;
    comparisonConfig: any;
  }[]
> => {
  function findNodeParent(c: string) {
    return treeFindPath(collectionTreeData, (node: any) => node.key === c)?.at(-2);
  }
  const allRequests = [];
  const requestIds = [...new Set(caseIds.map((c) => findNodeParent(c)?.key))];
  for (let i = 0; i < requestIds.length; i++) {
    allRequests.push(await FileSystemService.queryInterface({ id: requestIds[i] }));
  }

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

      const compareResult = await runCompareRESTRequest({
        endpoint: urlPretreatment(endpoint, envs),
        auth: null,
        name: '',
        preRequestScripts: [],
        compareEndpoint: urlPretreatment(compareEndpoint, envs),
        compareMethod: compareMethod,
        method: method,
        testScripts: testScripts,
        params: params,
        headers: headers,
        body: body,
      });

      const interfaceId = findNodeParent(caseId).key;
      const operationId = allRequests.find((i) => i.id === interfaceId).operationId;
      const comparisonConfig = await axios.get(
        `/report/config/comparison/summary/queryByInterfaceIdAndOperationId?interfaceId=${interfaceId}&operationId=${operationId}`,
      );
      const caseCompare = await axios
        .post('/report/compare/caseCompare', {
          msgCombination: {
            caseId: caseId,
            baseMsg: JSON.stringify(compareResult.responses[0]),
            testMsg: JSON.stringify(compareResult.responses[1]),
            comparisonConfig: comparisonConfig,
          },
        })
        .then((res) => {
          return res.body.diffResultCode;
        });

      results.push({
        caseRequest,
        compareResult,
        caseCompare,
        comparisonConfig,
      });
    } catch (e) {
      console.log(e);
    }
  }

  return results;
};

function isJson(obj) {
  return (
    typeof obj == 'object' &&
    Object.prototype.toString.call(obj).toLowerCase() === '[object object]' &&
    !obj.length
  );
}
export function checkResponsesIsJson(responses) {
  return isJson(responses[0]) && isJson(responses[1]);
}
