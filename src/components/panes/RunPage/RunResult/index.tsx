import { css } from '@emotion/react';
import { useMount } from 'ahooks';
import { Progress, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { matchUrlParams } from '../../../../helpers/functional/url';
import { useCustomSearchParams } from '../../../../router/useCustomSearchParams';
import { useStore } from '../../../../store';
import StatusTag from '../../../replay/StatusTag';
import DiffCard from '../../BatchComparePage/DiffCard';
import { calcProgressDetail } from '../../BatchComparePage/helper';
import useBatchCompareResults, {
  genCaseStructure,
} from '../../BatchComparePage/hooks/useBatchCompareResults';
import useQueryBatchCompareProgress from '../../BatchComparePage/hooks/useQueryBatchCompareProgress';

const columns = [
  {
    title: 'Interface',
    dataIndex: 'interfaceName',
    key: 'interfaceName',
  },
  ...[
    // { label: 'Init' },
    // { label: 'Wait' },
    { label: 'Success' },
    { label: 'Fail' },
    { label: 'Exception' },
  ].map((i, index) => {
    return {
      title: i.label,
      dataIndex: 'statusList',
      key: i.label,
      render(_: any): JSX.Element {
        return (
          <div
            css={css`
              color: ${{
                2: '#87d068',
                3: '#f50',
                4: 'orange',
              }[index + 2]};
            `}
          >
            {_.find((r: any) => {
              return r.status === index + 2;
            })?.count || 0}
          </div>
        );
      },
    };
  }),

  // 0:初始、1:等待比较、2：成功、3:失败、4：异常
  {
    title: 'Status',
    dataIndex: 'statusList',
    key: 'statusList',
    render(_: any, record: any) {
      return (
        <div>
          <StatusTag
            status={calcProgressDetail(record.statusList).status}
            successCaseCount={calcProgressDetail(record.statusList).successCaseCount}
            totalCaseCount={calcProgressDetail(record.statusList).totalCaseCount}
          ></StatusTag>
        </div>
      );
    },
  },
];
const RunResultPane = () => {
  const prm = useParams();

  const customSearchParams = useCustomSearchParams();
  console.log(
    JSON.parse(decodeURIComponent(customSearchParams.query.caseStructure)),
    'customSearchParams',
  );
  const { collectionTreeData, activeEnvironment } = useStore();
  const planId = prm.rawId;
  const caseStructure = JSON.parse(decodeURIComponent(customSearchParams.query.caseStructure));
  const { data: testData, run: testRun } = useBatchCompareResults(
    caseStructure,
    collectionTreeData,
    activeEnvironment?.keyValues || [],
    planId,
  );
  useMount(() => {
    // 进来就执行
    testRun();
  });
  const { data, run: runQueryBatchCompareProgress } = useQueryBatchCompareProgress({
    planId: planId,
  });
  const [timer, setTimer] = useState<any>(-1);
  useEffect(() => {
    clearInterval(timer);
    runQueryBatchCompareProgress(planId);
    const interval = setInterval(() => {
      runQueryBatchCompareProgress(planId).then((runQueryBatchCompareProgressRes) => {
        const statusNoDoneLen = runQueryBatchCompareProgressRes.filter((f: any) => f.status !== 2);
        if (statusNoDoneLen.length === 0 && runQueryBatchCompareProgressRes.length > 0) {
          clearInterval(interval);
        }
      });
    }, 3000);
    setTimer(interval);
    return () => clearInterval(interval);
  }, [planId]);

  return (
    <div
      css={css`
        display: block;
      `}
    >
      {data && (
        <Table
          columns={columns}
          dataSource={data}
          rowKey={'interfaceId'}
          expandable={{
            defaultExpandedRowKeys: [data ? data[0].interfaceId : ''],
            expandedRowRender: (record) => {
              return (
                <div style={{ margin: 0 }}>
                  <DiffCard planId={planId} interfaceId={record.interfaceId} />
                </div>
              );
            },
            rowExpandable: (record) => record.name !== 'Not Expandable',
          }}
        />
      )}
    </div>
  );
};

export default RunResultPane;
