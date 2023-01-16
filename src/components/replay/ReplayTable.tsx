import { useRequest } from 'ahooks';
import { theme, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import ReplayService from '../../services/Replay.service';
import { PlanStatistics } from '../../services/Replay.type';
import HighlightRowTable from '../styledComponents/HighlightRowTable';
import StatusTag from './StatusTag';

export type ResultsProps = {
  appId?: string;
  defaultSelectFirst?: boolean;
  refreshDep?: React.Key;
  onSelectedPlanChange: (selectedPlan: PlanStatistics) => void;
};

const ReplayTable: FC<ResultsProps> = ({
  appId,
  defaultSelectFirst,
  refreshDep,
  onSelectedPlanChange,
}) => {
  const { token } = theme.useToken();
  const { t } = useTranslation(['components']);
  const [search] = useSearchParams();
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
        <StatusTag
          status={record.status}
          successCaseCount={record.successCaseCount}
          totalCaseCount={record.totalCaseCount}
        />
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
      title: 'ReplayEndTime',
      dataIndex: 'replayEndTime',
      render(text) {
        return text ? new Date(text).toLocaleString() : '-';
      },
    },
  ];

  const {
    data: planStatistics,
    loading,
    cancel: cancelPollingInterval,
  } = useRequest(
    () =>
      ReplayService.queryPlanStatistics({
        appId,
        needTotal: true,
        pageSize: 100,
        pageIndex: 1,
      }),
    {
      ready: !!appId,
      refreshDeps: [appId, refreshDep],
      loadingDelay: 200,
      pollingInterval: 3000,
      onSuccess(res) {
        // 先判断是否有url参数
        const searchRes = res.find((i) => i.planId === search.get('planId'));
        if (searchRes) {
          onSelectedPlanChange(searchRes);
        } else {
          res.length && defaultSelectFirst && onSelectedPlanChange(res[0]);
        }
        res.every((record) => record.status !== 1) && cancelPollingInterval();
      },
    },
  );
  return (
    <HighlightRowTable<PlanStatistics>
      rowKey='planId'
      size='small'
      loading={loading}
      pagination={{ pageSize: 5 }}
      columns={columns}
      onRowClick={onSelectedPlanChange}
      dataSource={planStatistics}
      sx={{
        '.ant-table-cell-ellipsis': {
          color: token.colorPrimary,
        },
      }}
    />
  );
};

export default ReplayTable;
