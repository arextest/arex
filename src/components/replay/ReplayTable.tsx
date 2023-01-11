import { useRequest } from 'ahooks';
import { theme, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC } from 'react';

import ReplayService from '../../services/Replay.service';
import { PlanStatistics } from '../../services/Replay.type';
import HighlightRowTable from '../styledComponents/HighlightRowTable';
import StatusTag from './StatusTag';

const { Text } = Typography;

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

  const columns: ColumnsType<PlanStatistics> = [
    {
      title: 'ReplayReport Name',
      dataIndex: 'planName',
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip title={text} placement='topLeft'>
          <a>{text}</a>
        </Tooltip>
      ),
    },
    {
      title: 'State',
      render: (_, record) => <StatusTag status={record.status} />,
    },
    {
      title: 'Passed',
      width: 80,
      dataIndex: 'successCaseCount',
      render: (text) => <Text style={{ color: token.colorSuccessText }}>{text}</Text>,
    },
    {
      title: 'Failed',
      width: 80,
      dataIndex: 'failCaseCount',
      render: (text) => <Text style={{ color: token.colorErrorText }}>{text}</Text>,
    },
    {
      title: 'Invalid',
      width: 80,
      dataIndex: 'errorCaseCount',
      render: (text) => <Text style={{ color: token.colorInfoText }}>{text}</Text>,
    },
    {
      title: 'Blocked',
      width: 80,
      dataIndex: 'waitCaseCount',
      render: (text) => <Text style={{ color: token.colorWarningText }}>{text}</Text>,
    },
    {
      title: 'Executor',
      dataIndex: 'creator',
    },
    {
      title: 'replayStartTime',
      dataIndex: 'replayStartTime',
      render(text) {
        return text ? new Date(text).toLocaleString() : '';
      },
    },
  ];

  const { data: planStatistics, loading } = useRequest(
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
      onSuccess(res) {
        res.length && defaultSelectFirst && onSelectedPlanChange(res[0]);
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