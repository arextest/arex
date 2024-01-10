import 'chart.js/auto';

import {
  ContainerOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  FileTextOutlined,
  RedoOutlined,
  SearchOutlined,
  ShareAltOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { ReplayLogsDrawer } from '@arextest/arex-common';
import {
  copyToClipboard,
  HighlightRowTable,
  Label,
  SpaceBetweenWrapper,
  TooltipButton,
  useArexPaneProps,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import {
  App,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  InputRef,
  Row,
  Space,
  Statistic,
  Tag,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import CountUp from 'react-countup';

import { Icon } from '@/components';
import { ResultsState } from '@/components/StatusTag';
import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ReportService, ScheduleService } from '@/services';
import { PlanItemStatistic, PlanStatistics } from '@/services/ReportService';
import { useMenusPanes } from '@/store';

function getPercent(num: number, den: number, showPercentSign = true) {
  const value = num && den ? Math.floor((num / den) * 1000) / 10 : 0;
  return showPercentSign ? value + '%' : value;
}

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
} as const;

export type ReplayPlanItemProps = {
  appId: string;
  selectedPlan?: PlanStatistics;
  readOnly?: boolean;
  filter?: (record: PlanItemStatistic) => boolean;
  onRefresh?: () => void;
  onDelete?: (planId: string) => void;
};

const PlanItem: FC<ReplayPlanItemProps> = (props) => {
  const { selectedPlan, filter, onRefresh, onDelete } = props;
  const { message, modal } = App.useApp();
  const { activePane } = useMenusPanes();

  const { t } = useTranslation(['components', 'common']);
  const navPane = useNavPane();
  const { token } = theme.useToken();

  const [pollingInterval, setPollingInterval] = useState(true);
  const {
    data: planItemData = [],
    loading: loadingData,
    refresh,
    cancel: cancelPollingInterval,
  } = useRequest(
    () =>
      ReportService.queryPlanItemStatistics({
        planId: selectedPlan!.planId,
      }),
    {
      ready: !!selectedPlan?.planId,
      refreshDeps: [selectedPlan?.planId],
      loadingDelay: 200,
      pollingInterval: 6000,
      onSuccess(res) {
        if (res) {
          if (
            res?.every(
              (record) => ![ResultsState.RUNNING, ResultsState.RERUNNING].includes(record.status),
            ) ||
            (selectedPlan &&
              ![ResultsState.RUNNING, ResultsState.RERUNNING].includes(selectedPlan.status))
          ) {
            setPollingInterval(false);
            cancelPollingInterval();
          }
        } else {
          setPollingInterval(false);
          cancelPollingInterval();
        }
      },
    },
  );
  // optimize: cancel polling interval when pane is not active
  useEffect(() => {
    if (activePane?.id !== props.appId && pollingInterval) {
      setPollingInterval(false);
      cancelPollingInterval();
    } else if (activePane?.id === props.appId && !pollingInterval) {
      setPollingInterval(true);
      refresh();
    }
  }, [activePane, props.appId]);

  const planItemDataFiltered = useMemo(
    () => (filter ? planItemData?.filter(filter) : planItemData || []),
    [planItemData],
  );

  const countData = useMemo(
    () => [
      selectedPlan?.successCaseCount || 0,
      selectedPlan?.failCaseCount || 0,
      selectedPlan?.errorCaseCount || 0,
      selectedPlan?.waitCaseCount || 0,
    ],
    [selectedPlan],
  );

  const countSum = useMemo(() => countData.reduce((a, b) => (a || 0) + (b || 0), 0), [countData]);

  const pieData = useMemo(
    () => ({
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
    }),
    [countData],
  );

  const LegendBlock = ({ color, text }: { color: string; text: string }) => (
    <div>
      <div
        style={{
          width: '32px',
          height: '14px',
          display: 'inline-block',
          border: '2px solid #fff',
          marginRight: '8px',
          verticalAlign: 'text-bottom',
          backgroundColor: color,
        }}
      ></div>
      <Typography.Text style={{ color }}>{text}</Typography.Text>
    </div>
  );

  const CaseCountRender = useCallback(
    (count: number, record: PlanItemStatistic, status?: 0 | 1 | 2, readOnly: boolean = false) =>
      React.createElement(
        readOnly ? 'div' : Button,
        readOnly
          ? undefined
          : {
              type: 'link',
              size: 'small',
              onClick: () => {
                navPane({
                  type: PanesType.REPLAY_CASE,
                  id: record.planItemId,
                  // data: { ...record, filter: status },
                  data: { filter: status }, // fetch PlanItemStatistic data in ReplayCase instead of passing it
                });
              },
            },
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
        />,
      ),
    [token],
  );

  const searchInput = useRef<InputRef>(null);
  const columns = useMemo<ColumnsType<PlanItemStatistic>>(() => {
    const _columns: ColumnsType<PlanItemStatistic> = [
      {
        title: t('replay.api'),
        dataIndex: 'operationName',
        key: 'operationName',
        ellipsis: { showTitle: false },
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input.Search
              allowClear
              enterButton
              size='small'
              ref={searchInput}
              placeholder={`${t('search', { ns: 'common' })} ${t('replay.api')}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onSearch={(value, event) => {
                // @ts-ignore
                if (event.target?.localName === 'input') return;
                confirm();
              }}
              onPressEnter={() => confirm()}
            />
          </div>
        ),
        filterIcon: (filtered: boolean) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimaryActive : undefined }} />
        ),
        onFilter: (value, record) =>
          (record.operationName || '')
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
          visible && setTimeout(() => searchInput.current?.select(), 100);
        },
        render: (value) => {
          const split = (value ?? '').split('/');
          return (
            <Tooltip placement='topLeft' title={value}>
              {'/' + split[split.length - 1]}
            </Tooltip>
          );
        },
      },
      {
        title: t('replay.cases'),
        dataIndex: 'totalCaseCount',
        width: 72,
        render: (count, record) => CaseCountRender(count, record, undefined, props.readOnly),
      },
      {
        title: t('replay.passed'),
        dataIndex: 'successCaseCount',
        width: 72,
        render: (count, record) => CaseCountRender(count, record, 0, props.readOnly),
      },
      {
        title: t('replay.failed'),
        dataIndex: 'failCaseCount',
        width: 72,
        render: (count, record) => CaseCountRender(count, record, 1, props.readOnly),
      },
      {
        title: t('replay.invalid'),
        dataIndex: 'errorCaseCount',
        width: 72,
        render: (count, record) => CaseCountRender(count, record, 2, props.readOnly),
      },
      {
        title: t('replay.queued'),
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
    ];

    if (!props.readOnly) {
      _columns.push({
        title: t('replay.action'),
        align: 'center',
        render: (_, record) => (
          <>
            <TooltipButton
              icon={<ContainerOutlined />}
              title={t('replay.diffScenes')}
              breakpoint='lg'
              disabled={!record.failCaseCount}
              color='primary'
              onClick={() => {
                navPane({
                  type: PanesType.DIFF_SCENES,
                  id: record.planItemId,
                  data: record,
                });
              }}
            />
            <TooltipButton
              icon={<FileTextOutlined />}
              title={t('replay.case')}
              breakpoint='lg'
              color='primary'
              onClick={() => {
                navPane({
                  type: PanesType.REPLAY_CASE,
                  id: record.planItemId,
                  // data: record,
                });
              }}
            />
            <TooltipButton
              icon={<RedoOutlined />}
              title={t('replay.rerun')}
              breakpoint='lg'
              color='primary'
              onClick={() =>
                retryPlan({ planId: selectedPlan!.planId, planItemId: record.planItemId })
              }
            />
          </>
        ),
      });
    }
    return _columns;
  }, [props.readOnly, selectedPlan]);

  const { run: stopPlan } = useRequest(ScheduleService.stopPlan, {
    manual: true,
    ready: !!selectedPlan?.planId,
    onSuccess(success) {
      if (success) {
        message.success(t('message.success', { ns: 'common' }));
        onRefresh?.();
      } else {
        message.error(t('message.error', { ns: 'common' }));
      }
    },
  });

  const { run: deleteReport } = useRequest(ReportService.deleteReport, {
    manual: true,
    ready: !!selectedPlan?.planId,
    onSuccess(success, [planId]) {
      if (success) {
        message.success(t('message.success', { ns: 'common' }));
        onRefresh?.();
        onDelete?.(planId);
      } else {
        message.error(t('message.error', { ns: 'common' }));
      }
    },
  });

  const { run: retryPlan, loading: retrying } = useRequest(ScheduleService.reRunPlan, {
    manual: true,
    onSuccess(res) {
      if (res.result === 1) {
        message.success(t('message.success', { ns: 'common' }));
        onRefresh?.();
      } else {
        message.error(res.desc);
      }
    },
  });

  const [replayLogsDrawerOpen, setReplayLogsDrawerOpen] = useState(false);

  const extraMenuItems = useMemo(
    () => [
      {
        key: 'terminateReplay',
        label: t('replay.terminateTheReplay'),
        icon: <StopOutlined />,
      },
      {
        key: 'deleteReport',
        label: t('replay.deleteTheReport'),
        icon: <DeleteOutlined />,
      },
    ],
    [t],
  );

  const extraMenuHandler = useCallback(
    ({ key }: { key: string }) => {
      switch (key) {
        case 'terminateReplay': {
          stopPlan(selectedPlan!.planId);
          break;
        }
        case 'deleteReport': {
          modal.confirm({
            maskClosable: true,
            title: t('replay.confirmDeleteReport'),
            icon: <ExclamationCircleFilled />,
            okType: 'danger',
            onOk() {
              deleteReport(selectedPlan!.planId);
            },
          });

          break;
        }
      }
    },
    [planItemData, selectedPlan],
  );

  const [selectPlanItemKey, setSelectPlanItemKey] = useState<string>();
  const { data } = useArexPaneProps<{ planId: string; planItemId: string }>();

  useEffect(() => {
    setSelectPlanItemKey(undefined);
  }, [data?.planId]);
  useEffect(() => {
    data?.planItemId && setSelectPlanItemKey(data?.planItemId);
  }, [data?.planItemId]);

  const handleSelectPlanItem = (record: PlanItemStatistic) => {
    setSelectPlanItemKey(record.planItemId);
  };

  const handleSharePlan = () => {
    if (props.selectedPlan?.planId) {
      copyToClipboard(
        window.location.origin +
          window.location.pathname +
          `?planId=${props.selectedPlan?.planId}` +
          (selectPlanItemKey ? `&planItemId=${selectPlanItemKey}` : ''),
      );
      message.success(t('message.copySuccess', { ns: 'common' }));
    } else {
      message.warning(t('message.copyFailed', { ns: 'common' }));
    }
  };

  if (!selectedPlan) return null;

  return (
    <Card
      bordered={false}
      size='small'
      title={
        <>
          {`${t('replay.results')}: ${selectedPlan.planName}`}
          <Button size='small' type='link' icon={<ShareAltOutlined />} onClick={handleSharePlan} />
        </>
      }
      extra={
        <Space>
          <Button
            type='link'
            size='small'
            icon={<Icon name='ScrollText' />}
            disabled={props.readOnly}
            onClick={() => setReplayLogsDrawerOpen(true)}
          >
            {t('replay.logs')}
          </Button>

          <Dropdown.Button
            size='small'
            type='link'
            disabled={props.readOnly}
            loading={retrying}
            trigger={['click']}
            menu={{
              items: extraMenuItems,
              onClick: extraMenuHandler,
            }}
            onClick={() => retryPlan({ planId: selectedPlan!.planId })}
          >
            <RedoOutlined />
            {t('replay.rerun')}
          </Dropdown.Button>
        </Space>
      }
    >
      <Row gutter={12}>
        <Col span={12}>
          <Statistic
            title={t('replay.passRate')}
            value={getPercent(selectedPlan.successCaseCount, selectedPlan.totalCaseCount)}
          />
          <div>
            <Label>{t('replay.reportId')}</Label>
            {selectedPlan.planId}
          </div>
          <div>
            <Label>{t('replay.results')}</Label>
            {selectedPlan.planName}
          </div>
          <div>
            <Label>{t('replay.caseRange')}</Label>
            {dayjs(new Date(selectedPlan.caseStartTime || '')).format('YYYY/MM/DD')} -{' '}
            {dayjs(new Date(selectedPlan.caseEndTime || '')).format('YYYY/MM/DD')}
          </div>
          <div>
            <Label>{t('replay.targetHost')}</Label>
            {selectedPlan.targetEnv}
          </div>
          <div>
            <Label>{t('replay.executor')}</Label>
            {selectedPlan.creator}
          </div>
          {selectedPlan.caseTags && (
            <div style={{ marginTop: '2px' }}>
              <Label>{t('replay.caseTags')}</Label>
              <Space>
                {Object.entries(selectedPlan.caseTags || {}).map(([key, value]) => (
                  <Tag key={key}>
                    {key}:{value}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
        </Col>

        <Col span={12}>
          <Typography.Text type='secondary'>{t('replay.replayPassRate')}</Typography.Text>
          <SpaceBetweenWrapper>
            <div style={{ height: '180px', width: 'calc(100% - 160px)', padding: '16px 0' }}>
              <Pie data={pieData} options={pieOptions} />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                width: '160px',
                padding: '16px',
                marginTop: '24px',
              }}
            >
              <LegendBlock
                text={`${t('replay.passed')}: ${countData[0]}`}
                color={token.colorSuccessTextHover}
              />
              <LegendBlock
                text={`${t('replay.failed')}: ${countData[1]}`}
                color={token.colorErrorTextHover}
              />
              <LegendBlock
                text={`${t('replay.invalid')}: ${countData[2]}`}
                color={token.colorInfoTextHover}
              />
              <LegendBlock
                text={`${t('replay.blocked')}: ${countData[3]}`}
                color={token.colorWarningTextHover}
              />
              <Typography.Text strong type='secondary' style={{ marginTop: '8px' }}>
                {t('replay.totalCases')}: {countSum}
              </Typography.Text>
            </div>
          </SpaceBetweenWrapper>
        </Col>
      </Row>

      <br />

      <HighlightRowTable
        size='small'
        rowKey='planItemId'
        restHighlight={false}
        loading={loadingData}
        columns={columns}
        selectKey={selectPlanItemKey}
        dataSource={planItemDataFiltered}
        onRowClick={handleSelectPlanItem}
      />

      <ReplayLogsDrawer
        planId={selectedPlan?.planId}
        open={replayLogsDrawerOpen}
        request={ScheduleService.queryLogs}
        onClose={() => {
          setReplayLogsDrawerOpen(false);
        }}
      />
    </Card>
  );
};

export default PlanItem;
