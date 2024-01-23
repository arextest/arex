import {
  ContainerOutlined,
  FileTextOutlined,
  RedoOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { ReplayLogsDrawer } from '@arextest/arex-common';
import {
  HighlightRowTable,
  TooltipButton,
  useArexPaneProps,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Button, Input, InputRef, theme, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import CountUp from 'react-countup';

import { ResultsState } from '@/components/StatusTag';
import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import ReportCard, { ReportCardRef } from '@/panes/Replay/ReplayReport/ReportCard';
import ReportOverview from '@/panes/Replay/ReplayReport/ReportOverview';
import { ReportService, ScheduleService } from '@/services';
import { PlanItemStatistic, PlanStatistics } from '@/services/ReportService';
import { useMenusPanes } from '@/store';

export type ReplayReportProps = {
  appId: string;
  readOnly?: boolean;
  onDelete?: (planId: string) => void;
};

export type ReplayReportRef = {
  getReportList: (selectFirst?: boolean) => void;
};

const ReplayReport = forwardRef<ReplayReportRef, ReplayReportProps>((props, ref) => {
  const { data } = useArexPaneProps<{ planId: string; planItemId: string }>();
  const { activePane } = useMenusPanes();

  const { t } = useTranslation(['components', 'common']);
  const navPane = useNavPane();
  const { token } = theme.useToken();
  const [selectedPlan, setSelectedPlan] = useState<PlanStatistics>();

  const reportCardRef = useRef<ReportCardRef>(null);
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

  useImperativeHandle(
    ref,
    () => ({
      getReportList: (selectFirst) => {
        console.log('replay report getReportList');
        reportCardRef.current?.query(selectFirst);
      },
    }),
    [reportCardRef.current],
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
    () => planItemData?.filter((record) => !!record.totalCaseCount) || [],
    [planItemData],
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
                reportCardRef.current?.create({
                  planId: selectedPlan!.planId,
                  planItemId: record.planItemId,
                })
              }
            />
          </>
        ),
      });
    }
    return _columns;
  }, [props.readOnly, selectedPlan]);

  const [replayLogsDrawerOpen, setReplayLogsDrawerOpen] = useState(false);

  const [selectPlanItemKey, setSelectPlanItemKey] = useState<string>();

  useEffect(() => {
    setSelectPlanItemKey(undefined);
  }, [data?.planId]);
  useEffect(() => {
    data?.planItemId && setSelectPlanItemKey(data?.planItemId);
  }, [data?.planItemId]);

  const handleSelectPlanItem = (record: PlanItemStatistic) => {
    setSelectPlanItemKey(record.planItemId);
  };

  return (
    <ReportCard
      ref={reportCardRef}
      appId={props.appId}
      planId={selectedPlan?.planId}
      planItemId={selectPlanItemKey}
      readOnly={props.readOnly}
      onReportChange={setSelectedPlan}
      onLogsClick={() => setReplayLogsDrawerOpen(true)}
    >
      <ReportOverview data={selectedPlan} />
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

      {selectedPlan && (
        <ReplayLogsDrawer
          planId={selectedPlan?.planId}
          open={replayLogsDrawerOpen}
          request={ScheduleService.queryLogs}
          onClose={() => {
            setReplayLogsDrawerOpen(false);
          }}
        />
      )}
    </ReportCard>
  );
});

export default ReplayReport;
