// @ts-nocheck
import { useImmer } from 'use-immer';

import axios from '../../../../helpers/api/axios';
import { treeFind, treeFindPath } from '../../../../helpers/collection/util';
import { runCompareRESTRequest } from '../../../../helpers/CompareRequestRunner';
import { handleInherited } from '../../../../helpers/utils';
import { FileSystemService } from '../../../../services/FileSystem.service';
import { urlPretreatment } from '../../../http/helpers/utils/util';
// 定义参数数据结构
interface ICase {
  key: string;
  title: string;
  children: { key: string; title: string }[];
}
// 定义返回数据结构
interface ICaseResults {
  key: string;
  interfaceName: string;
  children: { key: string; caseName: string; diffResultCode: number; errCount: number }[];
}

export function genCaseStructure(checkValue, collectionTreeData): ICase[] {
  let allInterface = [];
  const allCase = [];
  for (let i = 0; i < checkValue.length; i++) {
    if (treeFind(collectionTreeData, (node) => node.key === checkValue[i])?.nodeType === 2) {
      const key = treeFindPath(collectionTreeData, (node) => node.key === checkValue[i]).at(
        -2,
      )?.key;
      allInterface.push(key);

      allCase.push(checkValue[i]);
    }
  }

  allInterface = [...new Set(allInterface)];

  const results = JSON.parse(
    JSON.stringify(
      allInterface.map((i) => {
        const interfaceTitle = treeFind(collectionTreeData, (node) => node.key === i)?.title;

        return { key: i, children: [], title: interfaceTitle };
      }),
    ),
  );
  for (let i = 0; i < allInterface.length; i++) {
    for (let j = 0; j < allCase.length; j++) {
      const parKey = treeFindPath(collectionTreeData, (node) => node.key === allCase[j])?.at(
        -2,
      )?.key;
      const interfaceKey = allInterface[i];
      if (parKey === interfaceKey) {
        const findIndex = results.findIndex((r) => r.key === allInterface[i]);

        const caseTitle = treeFind(collectionTreeData, (node) => node.key === allCase[j])?.title;

        results[findIndex].children.push({ key: allCase[j], title: caseTitle });
      }
    }
  }
  return results;
}

function transformBatchCompareCaseList(cases: ICase[]) {
  return cases.reduce((previousValue, currentValue) => {
    previousValue = [
      ...previousValue,
      ...currentValue.children.map((currentValueChildren) => ({
        interfaceId: currentValue.key,
        caseId: currentValueChildren.key,
        interfaceName: currentValue.title,
        caseName: currentValueChildren.title,
      })),
    ];
    return previousValue;
  }, []);
}

// 批量跑对比的结果
const useBatchCompareResults = (cases: ICase[], collectionTreeData, envs, planId) => {
  const [caseResults, setCaseResults] = useImmer<any[]>([]);

  async function run() {
    await FileSystemService.initBatchCompareReport({
      planId: planId,
      batchCompareCaseList: transformBatchCompareCaseList(cases),
    });

    setCaseResults([]);
    for (let i = 0; i < cases.length; i++) {
      for (let j = 0; j < cases[i].children.length; j++) {
        try {
          const caseId = cases[i].children[j].key;
          const caseRequest = await FileSystemService.queryCase({
            id: caseId,
            parentId: cases[i].key,
          });
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
          } = caseRequest;
          // 先使用interface的method和endpoint
          const compareResult = await runCompareRESTRequest(
            handleInherited({
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
            }),
          );

          const interfaceId = cases[i].key;
          const comparisonConfig = await axios
            .get(`/report/config/comparison/summary/queryByInterfaceId?interfaceId=${interfaceId}`)
            .then((res) => res.body);
          await FileSystemService.updateBatchCompareCase({
            planId: planId,
            interfaceId: interfaceId,
            caseId: caseId,
            baseMsg: JSON.stringify(compareResult.responses[0]),
            testMsg: JSON.stringify(compareResult.responses[1]),
            comparisonConfig: comparisonConfig,
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
