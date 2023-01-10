import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Button, Tree, TreeProps } from 'antd';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { urlPretreatment } from '../../components/arex-request/helpers/utils/util';
import axios from '../../helpers/api/axios';
import { genCaseTreeData } from '../../helpers/BatchRun/util';
import { treeFind } from '../../helpers/collection/util';
import { runCompareRESTRequest } from '../../helpers/CompareRequestRunner';
import { runRESTRequest } from '../../helpers/RequestRunner';
import { FileSystemService } from '../../services/FileSystem.service';
import { useStore } from '../../store';
import { getBatchCompareResults } from './util';

const BatchComparePage = () => {
  const { activeEnvironment } = useStore();
  const { data, loading } = useRequest(
    () => {
      return axios
        .post('/report/compare/quickCompare', {
          msgCombination: {
            baseMsg: JSON.stringify({ name: 'zt' }),
            testMsg: JSON.stringify({ name: 'wp' }),
          },
        })
        .then((res) => {
          const rows = res.body.diffDetails || [];
          return rows.map((r) => r.logs[0]);
        });
    },
    {
      refreshDeps: [],
    },
  );
  const { collectionTreeData } = useStore();
  const params = useParams();
  const caseTreeData = useMemo(() => {
    if (params.rType === 'BatchComparePage') {
      if (params.rTypeId && params.rTypeId.length === 24) {
        return genCaseTreeData([
          treeFind(collectionTreeData, (node) => node.key === params.rTypeId),
        ]);
      } else {
        return genCaseTreeData(collectionTreeData);
      }
    } else {
      return [];
    }
  }, [collectionTreeData, params.rTypeId, params.rType]);
  const [checkValue, setCheckValue] = useState([]);
  const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
    setCheckValue(checkedKeys);
  };
  return (
    <div>
      <div
        css={css`
          display: flex;
        `}
      >
        <div>
          <Tree checkable checkedKeys={checkValue} onCheck={onCheck} treeData={caseTreeData} />
        </div>
        <div>
          <Button
            onClick={() => {
              // getBatchCompareResults([checkValue[1],checkValue[2]],activeEnvironment.keyValues).then(r=>{
              //   console.log(r,'ssssss')
              // })
            }}
          >
            Run
          </Button>
        </div>
      </div>

      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

export default BatchComparePage;
