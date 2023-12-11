import { FilterOutlined, WarningOutlined } from '@ant-design/icons';
import {
  FullHeightSpin,
  HighlightRowTable,
  HighlightRowTableProps,
  useArexPaneProps,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Card, Tag, theme, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import CountUp from 'react-countup';

import { StatusTag } from '@/components';
import { ResultsState } from '@/components/StatusTag';
import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ReportService } from '@/services';
import { PlanStatistics } from '@/services/ReportService';
import { useMenusPanes } from '@/store';

const defaultPageSize = 5 as const;
const defaultCurrent = 1 as const;

export type PlanReportProps = {
  appId?: string;
  refreshDep?: React.Key;
  recordCount?: number;
  onSelectedPlanChange: (selectedPlan?: PlanStatistics) => void;
};

export type PlanReportRef = {
  select: (index: number) => void;
};
const PlanReport = forwardRef<PlanReportRef, PlanReportProps>((props, ref) => {
  const { appId, refreshDep, recordCount, onSelectedPlanChange } = props;
  const { activePane } = useMenusPanes();

  const { token } = theme.useToken();
  const { t } = useTranslation(['components']);
  const navPane = useNavPane();

  const [init, setInit] = useState(true);

  const { data } = useArexPaneProps<{
    planId: string;
  }>();

  const columns: ColumnsType<PlanStatistics> = [
    {
      title: t('replay.reportName'),
      dataIndex: 'planName',
      ellipsis: { showTitle: false },
    },
    {
      title: t('replay.state'),
      render: (_, record) => (
        <div style={{ overflow: 'hidden' }}>
          <StatusTag
            status={record.status}
            caseCount={record.successCaseCount + record.failCaseCount + record.errorCaseCount}
            totalCaseCount={record.totalCaseCount}
            message={record.errorMessage}
          />
        </div>
      ),
    },
    {
      title: t('replay.passed'),
      width: 80,
      dataIndex: 'successCaseCount',
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
      title: t('replay.failed'),
      width: 80,
      dataIndex: 'failCaseCount',
      render: (text) => (
        <CountUp preserveValue duration={0.3} end={text} style={{ color: token.colorErrorText }} />
      ),
    },
    {
      title: t('replay.invalid'),
      width: 80,
      dataIndex: 'errorCaseCount',
      render: (text) => (
        <CountUp preserveValue duration={0.3} end={text} style={{ color: token.colorInfoText }} />
      ),
    },
    {
      title: t('replay.queued'),
      width: 80,
      dataIndex: 'waitCaseCount',
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
      title: t('replay.executor'),
      dataIndex: 'creator',
    },
    {
      title: t('replay.replayStartTime'),
      dataIndex: 'replayStartTime',
      render(text) {
        return text ? new Date(text).toLocaleString() : '-';
      },
    },
    {
      title: t('replay.replayEndTime'),
      dataIndex: 'replayEndTime',
      render(text) {
        return text ? new Date(text).toLocaleString() : '-';
      },
    },
  ];

  const [pollingInterval, setPollingInterval] = useState(true);
  const {
    data: { list: planStatistics, pagination } = {
      list: [],
      pagination: {
        current: defaultCurrent,
        pageSize: defaultPageSize,
        total: 0,
      },
    },
    runAsync: queryPlanStatistics,
    loading,
    refresh,
    cancel: cancelPollingInterval,
  } = useRequest(
    (params) =>
      ReportService.queryPlanStatistics({
        appId,
        planId: data?.planId || undefined,
        current: defaultCurrent,
        pageSize: defaultPageSize,
        ...params,
      }),
    {
      ready: !!appId,
      loadingDelay: 200,
      pollingInterval: 6000,
      refreshDeps: [appId, refreshDep, data?.planId],
      onSuccess({ list }) {
        if (init) {
          list.length && handleRowClick?.(list[0], 1);
          setInit(false); // 设置第一次初始化标识);
        }

        if (
          list.every(
            (record) => ![ResultsState.RUNNING, ResultsState.RERUNNING].includes(record.status),
          )
        ) {
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

  const [selectKey, setSelectKey] = useState<string>();
  const handleRowClick: HighlightRowTableProps<PlanStatistics>['onRowClick'] = (record) => {
    const selected = record.planId === selectKey;
    const selectedRecord = selected ? undefined : record;
    setSelectKey(selectedRecord?.planId);
    onSelectedPlanChange(selectedRecord);
  };

  useImperativeHandle(
    ref,
    () => ({
      select: (index) => handleRowClick?.(planStatistics[index]),
    }),
    [planStatistics],
  );

  return (
    <FullHeightSpin
      spinning={init}
      // 为了 defaultCurrent 和 defaultRow 生效，需在初次获取到数据后再挂载子组件
      mountOnFirstLoading={false}
    >
      {/* display agentScript only when recordCount and planStatistics is empty */}
      {!init && !loading && !planStatistics.length && !recordCount ? (
        <Card>
          <Typography.Title level={5}>
            <WarningOutlined /> {t('replay.noRecordCountTip')}
          </Typography.Title>
          <Typography.Text code copyable>
            {`java -javaagent:</path/to/arex-agent.jar> -Darex.service.name=${appId} -Darex.storage.service.host=<storage.service.host:port> -jar <your-application.jar>`}
          </Typography.Text>
        </Card>
      ) : (
        <>
          <HighlightRowTable<PlanStatistics>
            rowKey='planId'
            size='small'
            loading={loading}
            columns={columns}
            selectKey={selectKey}
            pagination={pagination}
            onChange={(pagination) => {
              if (Object.keys(pagination).length) {
                queryPlanStatistics({
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                }).then(({ list }) => handleRowClick?.(list[0], 1));
              }
            }}
            onRowClick={handleRowClick}
            dataSource={planStatistics}
          />
          {data?.planId && (
            <div style={{ position: 'absolute', bottom: token.margin }}>
              <FilterOutlined style={{ marginRight: '8px' }} />
              <Tag
                closable
                onClose={() => {
                  console.log('close');
                  navPane({
                    id: appId!,
                    type: PanesType.REPLAY,
                    data: { planId: undefined },
                  });
                }}
              >
                {data.planId}
              </Tag>
            </div>
          )}
        </>
      )}
    </FullHeightSpin>
  );
});

export default PlanReport;
