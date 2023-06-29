import {
  FullHeightSpin,
  HighlightRowTable,
  HighlightRowTableProps,
  useTranslation,
} from '@arextest/arex-core';
import { usePagination } from 'ahooks';
import { theme, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useSearchParams } from 'react-router-dom';

import { StatusTag } from '@/components';
import { ReportService } from '@/services';
import { PlanStatistics } from '@/services/ReportService';
import { useMenusPanes } from '@/store';

const defaultPageSize = 5 as const;

export type PlanReportProps = {
  id?: string;
  appId?: string;
  refreshDep?: React.Key;
  onSelectedPlanChange: (
    selectedPlan: PlanStatistics | undefined,
    pagination: { current: number; key?: string },
  ) => void;
};

const PlanReport: FC<PlanReportProps> = (props) => {
  const { appId, refreshDep, onSelectedPlanChange } = props;
  const { activePane } = useMenusPanes();

  const { token } = theme.useToken();
  const { t } = useTranslation(['components']);
  const [searchParams] = useSearchParams();
  const [init, setInit] = useState(true);

  const defaultPagination = {
    defaultCurrent: parseInt(searchParams.get('current') || '1'),
    defaultRowKey: searchParams.get('key') || undefined,
  };

  const columns: ColumnsType<PlanStatistics> = [
    {
      title: t('replay.replayReportName'),
      dataIndex: 'planName',
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip title={text} placement='topLeft'>
          <a>{text}</a>
        </Tooltip>
      ),
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
      title: t('replay.blocked'),
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

  const {
    data: { list: planStatistics } = { list: [] },
    pagination,
    loading,
    refresh,
    cancel: cancelPollingInterval,
  } = usePagination(
    (params) =>
      ReportService.queryPlanStatistics({
        appId,
        ...params,
      }),
    {
      ready: !!appId,
      loadingDelay: 200,
      pollingInterval: 6000,
      defaultPageSize,
      defaultCurrent: defaultPagination.defaultCurrent,
      refreshDeps: [appId, refreshDep],
      onSuccess({ list }, [params]) {
        if (init) {
          const isValidKey = searchParams.get('key') !== '-1';
          if (isValidKey && list.length) {
            const plan =
              list.find((record) => record.planId === searchParams.get('key')) || list[0];
            plan && onSelectedPlanChange(plan, { current: params.current, key: plan.planId });
          }

          setInit(false); // 设置第一次初始化标识);
        }
        list.every((record) => record.status !== 1) && cancelPollingInterval();
      },
    },
  );

  // optimize: cancel polling interval when pane is not active
  useEffect(() => {
    activePane?.id !== props.id ? cancelPollingInterval() : refresh();
  }, [activePane, props.id]);

  const handleRowClick: HighlightRowTableProps<PlanStatistics>['onRowClick'] = (record, key) => {
    onSelectedPlanChange(record, { current: pagination.current, key });
  };

  return (
    <FullHeightSpin
      spinning={init}
      minHeight={240}
      // 为了 defaultCurrent 和 defaultRowKey 生效，需在初次获取到数据后再挂载子组件
      mountOnFirstLoading={false}
    >
      <HighlightRowTable<PlanStatistics>
        rowKey='planId'
        size='small'
        loading={loading}
        columns={columns}
        pagination={pagination}
        onRowClick={handleRowClick}
        dataSource={planStatistics}
        defaultCurrent={defaultPagination.defaultCurrent}
        defaultRowKey={defaultPagination.defaultRowKey}
        sx={{
          '.ant-table-cell-ellipsis': {
            color: token.colorPrimary,
          },
        }}
      />
    </FullHeightSpin>
  );
};

export default PlanReport;
