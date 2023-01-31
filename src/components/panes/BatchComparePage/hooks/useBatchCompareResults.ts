// @ts-nocheck
import { useImmer } from 'use-immer';

import axios from '../../../../helpers/api/axios';
import { treeFind, treeFindPath } from '../../../../helpers/collection/util';
import { runCompareRESTRequest } from '../../../../helpers/CompareRequestRunner';
import { FileSystemService } from '../../../../services/FileSystem.service';
import { urlPretreatment } from '../../../http/helpers/utils/util';
// 定义参数数据结构
interface ICase {
  key: string;
  children: { key: string }[];
}
// 定义返回数据结构
interface ICaseResults {
  key: string;
  interfaceName: string;
  children: { key: string; caseName: string; diffResultCode: number; errCount: number }[];
}

export function genCaseStructure(checkValue, collectionTreeData): ICase[] {
  const allInterface = [];
  const allCase = [];
  for (let i = 0; i < checkValue.length; i++) {
    if (treeFind(collectionTreeData, (node) => node.key === checkValue[i])?.nodeType === 1) {
      allInterface.push(checkValue[i]);
    }
    if (treeFind(collectionTreeData, (node) => node.key === checkValue[i])?.nodeType === 2) {
      allCase.push(checkValue[i]);
    }
  }
  const results = JSON.parse(JSON.stringify(allInterface.map((i) => ({ key: i, children: [] }))));
  for (let i = 0; i < allInterface.length; i++) {
    for (let j = 0; j < allCase.length; j++) {
      const parKey = treeFindPath(collectionTreeData, (node) => node.key === allCase[j])?.at(
        -2,
      )?.key;
      const interfaceKey = allInterface[i];
      if (parKey === interfaceKey) {
        const findIndex = results.findIndex((r) => r.key === allInterface[i]);
        results[findIndex].children.push({ key: allCase[j] });
      }
    }
  }
  return results;
}

// 批量跑对比的结果
const useBatchCompareResults = (cases: ICase[], collectionTreeData, envs) => {
  const [caseResults, setCaseResults] = useImmer<ICaseResults[]>([]);

  async function run() {
    setCaseResults([]);
    for (let i = 0; i < cases.length; i++) {
      const interfaceData = await FileSystemService.queryInterface({ id: cases[i].key });
      const interfaceCollectionInfo = treeFind(
        collectionTreeData,
        (node) => node.key === cases[i].key,
      );
      setCaseResults((draft) => {
        draft.push({
          key: cases[i].key,
          children: [],
          interfaceName: interfaceCollectionInfo.title,
        });
      });
      for (let j = 0; j < cases[i].children.length; j++) {
        try {
          const caseId = cases[i].children[j].key;
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

          const interfaceId = cases[i].key;
          const operationId = interfaceData.operationId;
          const comparisonConfig = await axios
            .get(
              `/report/config/comparison/summary/queryByInterfaceIdAndOperationId?interfaceId=${interfaceId}&operationId=${operationId}`,
            )
            .then((res) => res.body);
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
              return res.body;
            });
          setCaseResults((draft) => {
            draft[i].children.push({
              key: caseId,
              caseName: caseRequest.name,
              errCount: caseCompare.errCount,
              diffResultCode: caseCompare.diffResultCode,
              compareResultResponses: compareResult.responses,
            });
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
  return { data: caseResults, run };
};

export default useBatchCompareResults;
