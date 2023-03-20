// @ts-nocheck
import axios from '../../../helpers/api/axios';
import { runCompareRESTRequest } from '../../../helpers/http/CompareRequestRunner';
import { runRESTPreRequest } from '../../../helpers/http/RequestRunner';
import { handleInherited } from '../../../helpers/utils';
import { compressedData, decompressedData } from '../../../helpers/zstd';
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

  // const request =

  // const {
  //   endpoint,
  //   method,
  //   compareEndpoint,
  //   compareMethod,
  //   testScripts,
  //   headers,
  //   params,
  //   body,
  //   inherited,
  //   parentValue,
  // } = handleInherited(caseRequest);
  const prTestResultEnvs = await runRESTPreRequest(caseRequest);

  const prTestResultRequest = prTestResultEnvs.prTestResultRequest;

  const mergeRequest = handleInherited({
    ...caseRequest,
    ...prTestResultRequest,
  });

  const compareResult = await runCompareRESTRequest({
    ...mergeRequest,
    endpoint: urlPretreatment(mergeRequest.endpoint, [
      ...(envs || []),
      ...prTestResultEnvs.prTestResultEnvs,
    ]),
    compareEndpoint: urlPretreatment(mergeRequest.compareEndpoint, [
      ...(envs || []),
      ...prTestResultEnvs.prTestResultEnvs,
    ]),
    headers: mergeRequest.headers.filter(
      (f: { active?: boolean; key: string; value: string }) =>
        f.active && f.key !== '' && f.value !== '',
    ),
    params: mergeRequest.params.filter(
      (f: { active?: boolean; key: string; value: string }) =>
        f.active && f.key !== '' && f.value !== '',
    ),
  });

  const comparisonConfig = await axios
    .get(
      `/report/config/comparison/summary/queryByInterfaceIdAndOperationId?interfaceId=${interfaceId}&operationId=${operationId}`,
    )
    .then((res) => res.body);
  // TODO 暂时response用原始的，原因是zstd解压不了
  const compressedDataResponses0 = await compressedData(JSON.stringify(compareResult.responses[0]));
  const compressedDataResponses1 = await compressedData(JSON.stringify(compareResult.responses[1]));
  const quickCompare = await axios
    .post('/report/compare/quickCompare', {
      msgCombination: {
        caseId: caseId,
        baseMsg: compressedDataResponses0,
        testMsg: compressedDataResponses1,
        comparisonConfig: comparisonConfig,
      },
    })
    .then(async (res) => {
      return {
        ...res.body,
        baseMsg: await decompressedData(res.body.baseMsg),
        testMsg: await decompressedData(res.body.testMsg),
      };
    });

  return quickCompare;
}
