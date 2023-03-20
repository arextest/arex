import { css } from '@emotion/react';
import { Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useStore } from '../../../../store';
import StatusTag from '../../../replay/StatusTag';
import DiffCard from '../../BatchComparePage/DiffCard';
import { calcProgressDetail } from '../../BatchComparePage/helper';
import useBatchCompareResults, {
  genCaseStructure,
} from '../../BatchComparePage/hooks/useBatchCompareResults';
import useQueryBatchCompareProgress from '../../BatchComparePage/hooks/useQueryBatchCompareProgress';
import { getIncompleteKeys } from '../RunCreate/helper';

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
      const data = calcProgressDetail(record.statusList);
      return (
        <StatusTag
          status={data.status}
          caseCount={data.successCaseCount}
          totalCaseCount={data.totalCaseCount}
        />
      );
    },
  },
];
const RunResultPane = () => {
  const prm = useParams();
  const { collectionTreeData, activeEnvironment } = useStore();
  const planId = prm.rawId;

  const { data, run: runQueryBatchCompareProgress } = useQueryBatchCompareProgress({
    planId: planId,
  });
  const caseStructure = useMemo(() => {
    return genCaseStructure(getIncompleteKeys(data || []), collectionTreeData);
  }, [data]);
  const { data: testData, run: testRun } = useBatchCompareResults(
    collectionTreeData,
    activeEnvironment?.keyValues || [],
    planId,
  );
  const [checkRun, setCheckRun] = useState(false);
  useEffect(() => {
    if (data?.length > 0 && !checkRun) {
      setCheckRun(true);
      testRun(caseStructure);
    }
  }, [data, checkRun]);
  // 轮训，直到全部完成
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
  const metrics = [
    {
      title: 'Environment',
      value: 'test dev',
    },
    {
      title: 'Duration',
      value: '0ms',
    },
    {
      title: 'Avg. Resp. time',
      value: '0ms',
    },
  ];
  return (
    <div
      css={css`
        display: block;
      `}
    >
      <h2>Untitled - Run results</h2>
      <div
        css={css`
          display: flex;
          background-color: #ededed;
          padding: 20px;
          margin-bottom: 20px;
        `}
      >
        {metrics.map((metric, index) => {
          return (
            <div
              key={index}
              css={css`
                display: flex;
                flex-direction: column;
                margin: 0 20px 0px 0;
              `}
            >
              <span>{metric.title}</span>
              <span
                css={css`
                  font-size: 14px;
                  font-weight: bolder;
                `}
              >
                {metric.value}
              </span>
            </div>
          );
        })}
      </div>
      {data && (
        <Table
          size={'small'}
          columns={columns}
          dataSource={data}
          rowKey={'interfaceId'}
          expandable={{
            defaultExpandedRowKeys: [data[0] ? data[0].interfaceId : ''],
            expandedRowRender: (record) => {
              return (
                <div style={{ margin: 0 }}>
                  <DiffCard planId={planId} interfaceId={record?.interfaceId} />
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
