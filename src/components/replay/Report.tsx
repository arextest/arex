import 'chart.js/auto';

import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Badge, Button, Card, Col, Row, Statistic, Table, Tabs, Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';

import ReplayService from '../../services/Replay.service';
import { PlanItemStatistics, PlanStatistics } from '../../services/Replay.type';
import { getPercent } from '../../utils';
import { SmallTextButton, TableWrapper } from '../styledComponents';
import { Analysis, Case } from './index';
import { resultsStates } from './Results';

const { Text } = Typography;
const { TabPane } = Tabs;

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'left',
    },
  },
} as const;

const Report: FC<{ selectedPlan?: PlanStatistics }> = ({ selectedPlan }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [activeDetailTabsKey, setActiveDetailTabsKey] = useState<string>('analysis');

  const { data: planItemData } = useRequest(
    () =>
      ReplayService.queryPlanItemStatistics({
        planId: selectedPlan!.planId,
      }),
    {
      ready: !!selectedPlan?.planId,
      refreshDeps: [selectedPlan?.planId],
      cacheKey: 'queryPlanItemStatistics',
    },
  );

  const countData = [
    selectedPlan?.successCaseCount,
    selectedPlan?.failCaseCount,
    selectedPlan?.errorCaseCount,
    selectedPlan?.waitCaseCount,
  ];
  const countSum = useMemo(() => countData.reduce((a, b) => (a || 0) + (b || 0), 0), [countData]);

  const pieProps = useMemo(
    () => ({
      data: {
        labels: ['Passed', 'Failed', 'Invalid', 'Blocked'],
        datasets: [
          {
            data: countData,
            backgroundColor: ['#91cc75', '#ef6566', '#73c0de', '#fac858'],
          },
        ],
      },
      options: chartOptions,
    }),
    [countData],
  );

  const columns: ColumnsType<PlanItemStatistics> = [
    { title: 'Plan Item ID', dataIndex: 'planItemId', key: 'planItemId' },
    { title: 'API', dataIndex: 'operationName', key: 'operationName' },
    {
      title: 'State',
      render: (_, record) => {
        const state = resultsStates.find((s) => s.value === record.status);
        return state ? (
          <Tag color={state.color}>
            {state.label}
            {record.status === 1 && (
              <>
                <Badge status='processing' />
                {record.percent && <span>{record.percent > 99 ? 99 : record.percent}</span>}
              </>
            )}
          </Tag>
        ) : (
          <Tag>Unknown State</Tag>
        );
      },
    },
    {
      title: 'Time consumed(s)',
      render: (_, record) =>
        (record.replayEndTime - (record.replayStartTime || record.replayEndTime)) / 1000,
    },
    {
      title: 'Total Cases',
      dataIndex: 'totalCaseCount',
    },
    {
      title: 'Passed',
      dataIndex: 'successCaseCount',
      render: (text) => <Text type='success'>{text}</Text>,
    },
    {
      title: 'Failed',
      dataIndex: 'failCaseCount',
      render: (text) => <Text type='danger'>{text}</Text>,
    },
    {
      title: 'Invalid',
      dataIndex: 'errorCaseCount',
      render: (text) => <Text type='secondary'>{text}</Text>,
    },
    {
      title: 'Blocked',
      dataIndex: 'waitCaseCount',
      render: (text) => <Text type='secondary'>{text}</Text>,
    },
    {
      title: 'Action',
      width: 180,
      align: 'center',
      render: (_, record) => [
        <SmallTextButton
          key='detail'
          title='Detail'
          onClick={() =>
            // only expend one row at a time
            setExpandedRowKeys(expandedRowKeys[0] === record.planItemId ? [] : [record.planItemId])
          }
        />,
        <Button danger key='rerun' type='text' size='small'>
          Rerun
        </Button>,
      ],
    },
  ];

  return selectedPlan ? (
    <Card size='small' title={`Report: ${selectedPlan.planName}`}>
      <Row gutter={12}>
        <Col span={12}>
          <b style={{ color: 'gray' }}>Basic Information</b>
          <div
            css={css`
              display: flex;
              & > * {
                flex: 1;
              }
            `}
          >
            <Statistic
              title='Pass Rate'
              value={getPercent(selectedPlan.successCaseCount, selectedPlan.totalCaseCount)}
            />
            <Statistic
              title='API Pass Rate'
              value={getPercent(
                selectedPlan.successOperationCount,
                selectedPlan.totalOperationCount,
              )}
            />
          </div>
          <div>Report Name: {selectedPlan.planName}</div>
          <div>Target Host: {selectedPlan.targetHost}</div>
          <div>Executor: {selectedPlan.creator}</div>
          <span>Record version: {selectedPlan.caseRecordVersion}</span>
          <span>Replay version: {selectedPlan.coreVersion}</span>
        </Col>
        <Col span={12}>
          <b style={{ color: 'gray' }}>Replay Pass Rate</b>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ height: '160px', width: '100%', padding: '16px 0' }}>
              <Pie {...pieProps} />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                width: '160px',
                padding: '16px 16px 16px 0',
              }}
            >
              <div>Total Cases: {countSum}</div>
              <div>Passed: {countData[0]}</div>
              <div>Failed: {countData[1]}</div>
              <div>Blocked: {countData[2]}</div>
              <div>Invalid: {countData[3]}</div>
            </div>
          </div>
        </Col>
      </Row>

      <br />

      <Table
        size='small'
        rowKey='planItemId'
        columns={columns}
        dataSource={planItemData}
        expandable={{
          expandedRowKeys,
          showExpandColumn: false,
          expandedRowRender: (record) => (
            <Tabs
              size='small'
              activeKey={activeDetailTabsKey}
              onChange={setActiveDetailTabsKey}
              style={{ marginTop: '-8px' }}
            >
              <TabPane tab='Analysis' key='analysis'>
                <Analysis planItemId={record.planItemId} />
              </TabPane>
              <TabPane tab='Case' key='case'>
                <TableWrapper>
                  <Case planItemId={record.planItemId} />
                </TableWrapper>
              </TabPane>
            </Tabs>
          ),
        }}
      />
    </Card>
  ) : (
    <></>
  );
};

export default Report;
