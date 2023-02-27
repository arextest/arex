// @ts-nocheck
import axios from '../../../helpers/api/axios';
import { runCompareRESTRequest } from '../../../helpers/CompareRequestRunner';
import { handleInherited } from '../../../helpers/utils';
import { FileSystemService } from '../../../services/FileSystem.service';
import { urlPretreatment } from '../../http/helpers/utils/util';

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

export function flattenArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    result = [...result, ...arr[i]];
  }
  return result;
}

export async function sendQuickCompare({ caseId, nodeInfo, envs }) {
  const selfNode = nodeInfo.at(-1);
  const parNode = nodeInfo.at(-2);
  let caseRequest;
  let parRequest;
  if (selfNode.nodeType === 2) {
    caseRequest = await FileSystemService.queryCase({ id: caseId, parentId: parNode.key });
    parRequest = await FileSystemService.queryInterface({ id: parNode.key });
  } else if (selfNode.nodeType === 1) {
    caseRequest = await FileSystemService.queryInterface({ id: caseId });
    parRequest = caseRequest;
  }
  const { id: interfaceId, operationId } = parRequest;
  const {
    endpoint,
    method,
    compareEndpoint,
    compareMethod,
    testScripts,
    headers,
    params,
    body,
    inherited,
    parentValue,
  } = handleInherited(caseRequest);

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
    inherited: inherited,
    parentValue,
  });

  const comparisonConfig = await axios
    .get(
      `/report/config/comparison/summary/queryByInterfaceIdAndOperationId?interfaceId=${interfaceId}&operationId=${operationId}`,
    )
    .then((res) => res.body);
  const quickCompare = await axios
    .post('/report/compare/quickCompare', {
      msgCombination: {
        caseId: caseId,
        baseMsg: JSON.stringify(compareResult.responses[0]),
        testMsg: JSON.stringify(compareResult.responses[1]),
        comparisonConfig: comparisonConfig,
      },
    })
    .then((res) => {
      return res.body;
    });

  return quickCompare;
}
