import 'chart.js/auto';

import {
  ContainerOutlined,
  DeleteOutlined,
  DiffOutlined,
  FileTextOutlined,
  RedoOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import {
  App,
  Button,
  Card,
  Col,
  Dropdown,
  Popconfirm,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { EmailKey } from '../../constant';
import { getLocalStorage, getPercent } from '../../helpers/utils';
import { useCustomNavigate } from '../../router/useCustomNavigate';
import ReplayService from '../../services/Replay.service';
import { CreatePlanReq, PlanItemStatistics, PlanStatistics } from '../../services/Replay.type';
import { PagesType } from '../panes';
import { SmallTextButton, SpaceBetweenWrapper } from '../styledComponents';
import TooltipButton from '../TooltipButton';
import StatusTag from './StatusTag';

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'left',
    },
  },
} as const;

export type ReplayReportProps = {
  selectedPlan?: PlanStatistics;
  filter?: (record: PlanItemStatistics) => boolean;
  onRefresh?: () => void;
};

const ReplayReport: FC<ReplayReportProps> = (props) => {
  const { selectedPlan, filter, onRefresh } = props;
  const { message, notification } = App.useApp();
  const { t } = useTranslation(['components', 'common']);
  const params = useParams();
  const customNavigate = useCustomNavigate();
  const email = getLocalStorage<string>(EmailKey);
  const { token } = theme.useToken();

  const {
    data: planItemData = [],
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
      pollingInterval: 6000,
      onSuccess(res) {
        if (res) {
          res.every((record) => record.status !== 1) &&
            selectedPlan?.status !== 1 &&
            cancelPollingInterval();
        } else cancelPollingInterval();
      },
    },
  );

  const planItemDataFiltered = useMemo(
    () => (filter ? planItemData?.filter(filter) : planItemData || []),
    [planItemData],
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
        labels: [t('replay.passed'), t('replay.failed'), t('replay.invalid'), t('replay.blocked')],
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

  const CaseCountRender = useCallback(
    (count: number, record: PlanItemStatistics, status?: 0 | 1 | 2) => (
      <Button
        type='link'
        size='small'
        onClick={() => {
          customNavigate(
            `/${params.workspaceId}/${PagesType.ReplayCase}/${
              record.planItemId
            }?data=${encodeURIComponent(JSON.stringify(record))}${
              Number.isInteger(status) ? `&status=${status}` : ''
            }`,
          );
        }}
      >
        <CountUp
          preserveValue
          duration={0.3}
          end={count}
          style={{
            color:
              status === undefined
                ? token.colorText
                : [token.colorSuccessText, token.colorErrorText, token.colorInfoText][status],
          }}
        />
      </Button>
    ),
    [token],
  );

  const columns: ColumnsType<PlanItemStatistics> = [
    {
      title: t('replay.planItemID'),
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
      title: t('replay.api'),
      dataIndex: 'operationName',
      key: 'operationName',
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip placement='topLeft' title={value}>
          {'/' + (value ?? '').split('/').at(-1)}
        </Tooltip>
      ),
    },
    {
      title: t('replay.state'),
      width: 80,
      render: (_, record) => (
        <StatusTag
          status={record.status}
          caseCount={record.successCaseCount}
          totalCaseCount={record.totalCaseCount}
          message={record.errorMessage}
        />
      ),
    },
    {
      title: t('replay.timeConsumed'),
      width: 80,
      render: (_, record) =>
        record.replayEndTime && record.replayStartTime
          ? (record.replayEndTime - record.replayStartTime) / 1000
          : '-',
    },
    {
      title: t('replay.cases'),
      dataIndex: 'totalCaseCount',
      width: 72,
      render: (count, record) => CaseCountRender(count, record),
    },
    {
      title: t('replay.passed'),
      dataIndex: 'successCaseCount',
      width: 72,
      render: (count, record) => CaseCountRender(count, record, 0),
    },
    {
      title: t('replay.failed'),
      dataIndex: 'failCaseCount',
      width: 72,
      render: (count, record) => CaseCountRender(count, record, 1),
    },
    {
      title: t('replay.invalid'),
      dataIndex: 'errorCaseCount',
      width: 72,
      render: (count, record) => CaseCountRender(count, record, 2),
    },
    {
      title: t('replay.blocked'),
      dataIndex: 'waitCaseCount',
      width: 72,
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
      title: t('replay.action'),
      align: 'center',
      render: (_, record) => (
        <>
          <TooltipButton
            icon={<DiffOutlined />}
            title={t('replay.diffScenesNew')}
            breakpoint='xxl'
            disabled={!record.failCaseCount}
            color={record.failCaseCount ? 'primary' : 'disabled'}
            onClick={() => {
              customNavigate(
                `/${params.workspaceId}/${PagesType.ReplayDiff}/${
                  record.planItemId
                }?data=${encodeURIComponent(JSON.stringify(record))}`,
              );
            }}
          />
          <TooltipButton
            icon={<ContainerOutlined />}
            title={t('replay.diffScenes')}
            breakpoint='xxl'
            disabled={!record.failCaseCount}
            color={record.failCaseCount ? 'primary' : 'disabled'}
            onClick={() => {
              customNavigate(
                `/${params.workspaceId}/${PagesType.ReplayAnalysis}/${
                  record.planItemId
                }?data=${encodeURIComponent(JSON.stringify(record))}`,
              );
            }}
          />
          <TooltipButton
            icon={<FileTextOutlined />}
            title={t('replay.case')}
            breakpoint='xxl'
            color='primary'
            onClick={() => {
              customNavigate(
                `/${params.workspaceId}/${PagesType.ReplayCase}/${
                  record.planItemId
                }?data=${encodeURIComponent(JSON.stringify(record))}`,
              );
            }}
          />
          <Popconfirm
            title={t('replay.rerun')}
            description={t('replay.rerunTip')}
            onConfirm={() =>
              handleRerun({
                operationId: record.operationId,
                caseSourceFrom: record.caseStartTime,
                caseSourceTo: record.caseEndTime,
              })
            }
            onCancel={() => {
              handleRerunError({ key: 'rerunInterface' }, record);
            }}
            okText={t('replay.rerun')}
            cancelText={t('replay.rerunError')}
          >
            <TooltipButton
              tooltipProps={{ open: false }}
              icon={<RedoOutlined />}
              title={t('replay.rerun')}
              breakpoint='xxl'
              color='primary'
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  const { run: terminatePlanStatistics } = useRequest(ReplayService.terminatePlanStatistics, {
    manual: true,
    ready: !!selectedPlan?.planId,
    onSuccess(success) {
      success
        ? message.success(t('message.success', { ns: 'common' }))
        : message.error(t('message.error', { ns: 'common' }));
    },
  });

  const { run: deletePlanStatistics } = useRequest(ReplayService.deletePlanStatistics, {
    manual: true,
    ready: !!selectedPlan?.planId,
    onSuccess(success) {
      success
        ? message.success(t('message.success', { ns: 'common' }))
        : message.error(t('message.error', { ns: 'common' }));
    },
  });

  const [creatingPlan, setCreatingPlan] = useState<number>();
  const { run: rerun } = useRequest(ReplayService.createPlan, {
    manual: true,
    onBefore([param]) {
      setCreatingPlan(param.replayPlanType);
    },
    onSuccess(res) {
      if (res.result === 1) {
        onRefresh?.();
        notification.success({
          message: t('message.success', { ns: 'common' }),
          description: res.desc,
        });
      } else {
        notification.error({
          message: t('message.error', { ns: 'common' }),
          description: res.desc,
        });
      }
    },
    onFinally() {
      setCreatingPlan(undefined);
    },
  });

  const handleRerun = (
    params?: { operationId?: string } & Partial<
      Pick<CreatePlanReq, 'caseSourceFrom' | 'caseSourceTo' | 'operationCaseInfoList'>
    >,
    operationName?: string,
  ) => {
    const { operationId, caseSourceFrom, caseSourceTo, operationCaseInfoList } = params || {};
    if (operationId && caseSourceFrom && caseSourceTo) {
      // 创建新的回放
      rerun({
        caseSourceFrom,
        caseSourceTo,
        appId: selectedPlan!.appId,
        caseSourceType: 0,
        operationCaseInfoList: [{ operationId }],
        operator: email,
        replayPlanType: 1,
        sourceEnv: 'pro',
        targetEnv: selectedPlan!.targetHost as string,
      });
    } else if (
      selectedPlan?.caseStartTime &&
      selectedPlan?.caseEndTime &&
      selectedPlan?.targetHost
    ) {
      // 重新执行回放
      rerun({
        caseSourceFrom: selectedPlan.caseStartTime,
        caseSourceTo: selectedPlan.caseEndTime,
        appId: selectedPlan!.appId,
        operationCaseInfoList, // 重新执行失败的用例
        operator: email,
        replayPlanType: operationCaseInfoList ? 2 : 0,
        planName: operationCaseInfoList
          ? operationName
            ? selectedPlan.planName + `-${operationName}-rerun`
            : selectedPlan.planName + '-rerun'
          : undefined,
        sourceEnv: 'pro',
        targetEnv: selectedPlan!.targetHost,
      });
    }
  };

  const { run: queryPlanFailCase } = useRequest(ReplayService.queryPlanFailCase, {
    manual: true,
    onSuccess(failCaseList, [params, operationName]) {
      handleRerun({ operationCaseInfoList: failCaseList }, operationName);
    },
  });

  const handleRerunError = (e: { key: string }, planItem?: PlanItemStatistics) => {
    if (e.key === 'rerunErrorPlan') queryPlanFailCase({ planId: selectedPlan!.planId });
    else if (e.key === 'rerunInterface')
      queryPlanFailCase(
        { planId: selectedPlan!.planId, planItemIdList: [planItem!.planItemId] },
        planItem!.operationName,
      );
  };

  return selectedPlan ? (
    <Card
      bordered={false}
      size='small'
      title={`${t('replay.report')}: ${selectedPlan.planName}`}
      extra={
        <Space>
          <Popconfirm
            title={t('replay.terminateTheReplay')}
            description={t('replay.confirmTerminateReplay')}
            onConfirm={() => terminatePlanStatistics(selectedPlan!.planId)}
          >
            <SmallTextButton
              color={'primary'}
              icon={<StopOutlined />}
              title={t('replay.terminate')}
            />
          </Popconfirm>

          <Popconfirm
            title={t('replay.deleteTheReport')}
            description={t('replay.confirmDeleteReport')}
            onConfirm={() => deletePlanStatistics(selectedPlan!.planId)}
          >
            <SmallTextButton
              color={'primary'}
              icon={<DeleteOutlined />}
              title={t('replay.delete')}
            />
          </Popconfirm>

          <Dropdown.Button
            size='small'
            type='text'
            disabled={creatingPlan === 0}
            menu={{
              items: [
                { label: t('replay.rerunError'), key: 'rerunErrorPlan', icon: <RedoOutlined /> },
              ],
              onClick: handleRerunError,
            }}
            onClick={() => handleRerun()}
            css={css`
              button {
                color: ${token.colorPrimary};
              }
            `}
          >
            <Spin
              spinning={creatingPlan === 0}
              css={css`
                span.anticon-loading {
                  font-size: 16px !important;
                }
              `}
            >
              <Space>
                <RedoOutlined />
                {t('replay.rerun')}
              </Space>
            </Spin>
          </Dropdown.Button>
        </Space>
      }
    >
      <Row gutter={12}>
        <Col span={12}>
          <Typography.Text type='secondary'>{t('replay.basicInfo')}</Typography.Text>
          <div
            css={css`
              display: flex;
              & > * {
                flex: 1;
              }
            `}
          >
            <Statistic
              title={t('replay.passRate')}
              value={getPercent(selectedPlan.successCaseCount, selectedPlan.totalCaseCount)}
            />
            <Statistic
              title={t('replay.apiPassRate')}
              value={getPercent(
                selectedPlan.successOperationCount,
                selectedPlan.totalOperationCount,
              )}
            />
          </div>
          <div>
            {t('replay.reportName')}: {selectedPlan.planName}
          </div>
          <div>
            {t('replay.caseRange')}:{' '}
            {dayjs(new Date(selectedPlan.caseStartTime || '')).format('YYYY/MM/DD')} -{' '}
            {dayjs(new Date(selectedPlan.caseEndTime || '')).format('YYYY/MM/DD')}
          </div>
          <div>
            {t('replay.targetHost')}: {selectedPlan.targetHost}
          </div>
          <div>
            {t('replay.executor')}: {selectedPlan.creator}
          </div>
          <div>
            <span>
              {t('replay.recordVersion')}: {selectedPlan.caseRecordVersion || '-'}
            </span>
            &nbsp;
            <span>
              {t('replay.replayVersion')}: {selectedPlan.coreVersion || '-'}
            </span>
          </div>
        </Col>

        <Col span={12}>
          <Typography.Text type='secondary'>{t('replay.replayPassRate')}</Typography.Text>
          <SpaceBetweenWrapper>
            <div style={{ height: '180px', width: 'calc(100% - 160px)', padding: '16px 0' }}>
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
              <div>
                {t('replay.totalCases')}: {countSum}
              </div>
              <div>
                {t('replay.passed')}: {countData[0]}
              </div>
              <div>
                {t('replay.failed')}: {countData[1]}
              </div>
              <div>
                {t('replay.invalid')}: {countData[2]}
              </div>
              <div>
                {t('replay.blocked')}: {countData[3]}
              </div>
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
        dataSource={planItemDataFiltered}
        style={{ overflow: 'auto' }}
      />
    </Card>
  ) : null;
};

export default ReplayReport;
