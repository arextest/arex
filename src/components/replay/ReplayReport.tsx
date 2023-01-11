import 'chart.js/auto';

import { ContainerOutlined, FileTextOutlined, RedoOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Card, Col, notification, Row, Statistic, Table, theme, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import CountUp from 'react-countup';

import { EmailKey } from '../../constant';
import { generateGlobalPaneId, getLocalStorage, getPercent } from '../../helpers/utils';
import { MenusType } from '../../menus';
import { PagesType } from '../../pages';
import ReplayService from '../../services/Replay.service';
import { PlanItemStatistics, PlanStatistics } from '../../services/Replay.type';
import { useStore } from '../../store';
import { SmallTextButton, SpaceBetweenWrapper } from '../styledComponents';
import TooltipButton from '../TooltipButton';
import StatusTag from './StatusTag';

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

const ReplayReport: FC<{ selectedPlan?: PlanStatistics }> = ({ selectedPlan }) => {
  const { setPages } = useStore();
  const email = getLocalStorage<string>(EmailKey);
  const { token } = theme.useToken();

  const {
    data: planItemData,
    loading: loadingData,
    cancel: cancelPollingInterval,
  } = useRequest(
    () =>
      ReplayService.queryPlanItemStatistics({
        planId: selectedPlan!.planId,
      }),
    {
      ready: !!selectedPlan?.planId,
      refreshDeps: [selectedPlan?.planId],
      loadingDelay: 200,
      pollingInterval: 3000,
      onSuccess(res) {
        res.every((record) => record.status !== 1) && cancelPollingInterval();
      },
    },
  );

  const countData = useMemo(
    () => [
      selectedPlan?.successCaseCount,
      selectedPlan?.failCaseCount,
      selectedPlan?.errorCaseCount,
      selectedPlan?.waitCaseCount,
    ],
    [selectedPlan],
  );

  const countSum = useMemo(() => countData.reduce((a, b) => (a || 0) + (b || 0), 0), [countData]);

  const pieProps = useMemo(
    () => ({
      data: {
        labels: ['Passed', 'Failed', 'Invalid', 'Blocked'],
        datasets: [
          {
            data: countData,
            backgroundColor: [
              token.colorSuccessTextHover,
              token.colorErrorTextHover,
              token.colorInfoTextHover,
              token.colorWarningTextHover,
            ],
          },
        ],
      },
      options: chartOptions,
    }),
    [countData],
  );

  const columns: ColumnsType<PlanItemStatistics> = [
    {
      title: 'Plan Item ID',
      dataIndex: 'planItemId',
      key: 'planItemId',
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip placement='topLeft' title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'API',
      dataIndex: 'operationName',
      key: 'operationName',
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip placement='topLeft' title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'State',
      render: (_, record) => (
        <StatusTag
          status={record.status}
          successCaseCount={record.successCaseCount}
          totalCaseCount={record.totalCaseCount}
        />
      ),
    },
    {
      title: 'Time consumed(s)',
      render: (_, record) =>
        record.replayEndTime && record.replayStartTime
          ? (record.replayEndTime - record.replayStartTime) / 1000
          : '-',
    },
    {
      title: 'Cases',
      dataIndex: 'totalCaseCount',
    },
    {
      title: 'Passed',
      dataIndex: 'successCaseCount',
      width: 70,
      render: (text) => (
        <CountUp
          preserveValue
          duration={0.3}
          end={text}
          style={{ color: token.colorSuccessText }}
        />
      ),
    },
    {
      title: 'Failed',
      dataIndex: 'failCaseCount',
      width: 70,
      render: (text) => (
        <CountUp preserveValue duration={0.3} end={text} style={{ color: token.colorErrorText }} />
      ),
    },
    {
      title: 'Invalid',
      dataIndex: 'errorCaseCount',
      width: 70,
      render: (text) => (
        <CountUp preserveValue duration={0.3} end={text} style={{ color: token.colorInfoText }} />
      ),
    },
    {
      title: 'Blocked',
      dataIndex: 'waitCaseCount',
      width: 70,
      render: (text) => (
        <CountUp
          preserveValue
          duration={0.3}
          end={text}
          style={{ color: token.colorWarningText }}
        />
      ),
    },
    {
      title: 'Action',
      align: 'center',
      render: (_, record) => (
        <>
          <TooltipButton
            icon={<ContainerOutlined />}
            title='DiffScenes'
            breakpoint='xxl'
            disabled={!record.failCaseCount}
            onClick={() => {
              setPages(
                {
                  title: `DiffScenes - ${record.operationId}`,
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
            style={{
              color: record.failCaseCount ? token.colorPrimary : token.colorTextDisabled,
            }}
          />
          <TooltipButton
            icon={<FileTextOutlined />}
            title='CaseTable'
            breakpoint='xxl'
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
            style={{ color: token.colorPrimary }}
          />
          <TooltipButton
            icon={<RedoOutlined />}
            title='Rerun'
            breakpoint='xxl'
            onClick={() =>
              handleRerun(record.operationId, record.caseStartTime, record.caseEndTime)
            }
            style={{ color: token.colorPrimary }}
          />
        </>
      ),
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
        <SmallTextButton icon={<RedoOutlined />} onClick={() => handleRerun()}>
          Rerun
        </SmallTextButton>
      }
    >
      <Row gutter={12}>
        <Col span={12}>
          <Typography.Text type='secondary'>Basic Information</Typography.Text>
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
          <Typography.Text type='secondary'>Replay Pass Rate</Typography.Text>
          <SpaceBetweenWrapper>
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
          </SpaceBetweenWrapper>
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
    <div></div>
  );
};

export default ReplayReport;
