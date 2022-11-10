import 'chart.js/auto';

import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import {
  Badge,
  Button,
  Card,
  Col,
  notification,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';

import { generateGlobalPaneId, getPercent } from '../../helpers/utils';
import { MenusType } from '../../menus';
import { PagesType } from '../../pages';
import ReplayService from '../../services/Replay.service';
import { PlanItemStatistics, PlanStatistics } from '../../services/Replay.type';
import { useStore } from '../../store';
import { SmallTextButton } from '../styledComponents';
import { resultsStates } from './Results';

const { Text } = Typography;

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
  const {
    userInfo: { email },
    setPages,
  } = useStore();

  const { data: planItemData, loading: loadingData } = useRequest(
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
      width: 100,
      render: (_, record) => {
        const state = resultsStates.find((s) => s.value === record.status);
        return state ? (
          <Tag color={state.color}>
            {state.label}
            {record.status === 1 && (
              <span style={{ margin: '0 -4px 0 8px' }}>
                <Badge status='processing' />
                {record.percent && <span>{record.percent > 99 ? 99 : record.percent}</span>}
              </span>
            )}
          </Tag>
        ) : (
          <Tag>Unknown State</Tag>
        );
      },
    },
    {
      title: 'Time consumed(s)',
      width: 104,
      render: (_, record) =>
        record.replayEndTime && record.replayStartTime
          ? (record.replayEndTime - record.replayStartTime) / 1000
          : '-',
    },
    {
      title: 'Total Cases',
      dataIndex: 'totalCaseCount',
      width: 120,
      filterMultiple: false,
      filters: [
        { text: 'All', value: 'all' },
        { text: 'Valid', value: 'valid' },
      ],
      defaultFilteredValue: ['valid'],
      onFilter: (value, record) => value !== 'valid' || !!record.totalCaseCount,
    },
    {
      title: 'Passed',
      dataIndex: 'successCaseCount',
      width: 70,
      render: (text) => <Text style={{ color: '#91cc75' }}>{text}</Text>,
    },
    {
      title: 'Failed',
      dataIndex: 'failCaseCount',
      width: 70,
      render: (text) => <Text style={{ color: '#ef6566' }}>{text}</Text>,
    },
    {
      title: 'Invalid',
      dataIndex: 'errorCaseCount',
      width: 70,
      render: (text) => <Text style={{ color: '#73c0de' }}>{text}</Text>,
    },
    {
      title: 'Blocked',
      dataIndex: 'waitCaseCount',
      width: 70,
      render: (text) => <Text style={{ color: '#fac858' }}>{text}</Text>,
    },
    {
      title: 'Action',
      width: 200,
      align: 'center',
      render: (_, record) => [
        <SmallTextButton
          key='analysis'
          title='Analysis'
          onClick={() => {
            setPages(
              {
                title: `Analysis - ${record.operationId}`,
                pageType: PagesType.ReplayAnalysis,
                menuType: MenusType.Replay,
                isNew: false,
                data: record,
                paneId: generateGlobalPaneId(
                  MenusType.Replay,
                  PagesType.ReplayAnalysis,
                  record.operationId,
                ),
                rawId: record.operationId,
              },
              'push',
            );
          }}
        />,
        <SmallTextButton
          key='case'
          title='Case'
          onClick={() =>
            setPages(
              {
                title: `Case - ${record.planItemId}`,
                pageType: PagesType.ReplayCase,
                menuType: MenusType.Replay,
                isNew: false,
                data: record,
                paneId: generateGlobalPaneId(
                  MenusType.Replay,
                  PagesType.ReplayCase,
                  record.planItemId,
                ),
                rawId: record.planItemId,
              },
              'push',
            )
          }
        />,
        <Button
          danger
          key='rerun'
          type='text'
          size='small'
          onClick={() => handleRerun(record.operationId, record.caseStartTime, record.caseEndTime)}
        >
          Rerun
        </Button>,
      ],
    },
  ];

  const { run: rerun } = useRequest(ReplayService.createPlan, {
    manual: true,
    onSuccess(res) {
      if (res.result === 1) {
        notification.success({ message: 'Success', description: res.desc });
      } else {
        console.error(res.desc);
        notification.error({
          message: 'Error',
          description: res.desc,
        });
      }
    },
  });

  const handleRerun = (operationId?: string, caseStartTime?: number, caseEndTime?: number) => {
    if (operationId && caseStartTime && caseEndTime) {
      rerun({
        caseStartTime,
        caseEndTime,
        appId: selectedPlan!.appId,
        caseSourceType: 0,
        operationCaseInfoList: [{ operationId }],
        operator: email as string,
        replayPlanType: 1,
        sourceEnv: 'pro',
        targetEnv: selectedPlan!.targetHost as string,
      });
    } else if (
      selectedPlan?.caseStartTime &&
      selectedPlan?.caseEndTime &&
      selectedPlan?.targetHost
    ) {
      rerun({
        caseStartTime: selectedPlan.caseStartTime,
        caseEndTime: selectedPlan.caseEndTime,
        appId: selectedPlan!.appId,
        operator: email as string,
        replayPlanType: 0,
        sourceEnv: 'pro',
        targetEnv: selectedPlan!.targetHost,
      });
    }
  };

  return selectedPlan ? (
    <Card
      bordered={false}
      size='small'
      title={`Report: ${selectedPlan.planName}`}
      extra={
        <Button size='small' type='primary' onClick={() => handleRerun()}>
          Rerun
        </Button>
      }
    >
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
          <span>Record version: {selectedPlan.caseRecordVersion}</span> &nbsp;
          <span>Replay version: {selectedPlan.coreVersion}</span>
        </Col>
        <Col span={12}>
          <b style={{ color: 'gray' }}>Replay Pass Rate</b>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ height: '160px', width: 'calc(100% - 160px)', padding: '16px 0' }}>
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
              <div>Invalid: {countData[2]}</div>
              <div>Blocked: {countData[3]}</div>
            </div>
          </div>
        </Col>
      </Row>

      <br />

      <Table
        size='small'
        rowKey='planItemId'
        loading={loadingData}
        columns={columns}
        dataSource={planItemData}
        style={{ overflow: 'auto' }}
      />
    </Card>
  ) : (
    <></>
  );
};

export default Report;
