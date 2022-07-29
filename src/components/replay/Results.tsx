import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Badge, Table, Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { FC, useState } from 'react';

import ReplayService from '../../api/Replay.service';
import { PlanStatistics } from '../../api/Replay.type';
import { useStore } from '../../store';
import { Theme } from '../../style/theme';
const { Text } = Typography;

export const resultsStates = [
  { label: 'init', color: 'grey', value: 0 },
  { label: 'running', color: 'orange', value: 1 },
  { label: 'done', color: 'green', value: 2 },
  { label: 'interrupted', color: 'red', value: 3 },
  { label: 'cancelled', color: 'blue', value: 4 },
];

const columns: ColumnsType<PlanStatistics> = [
  {
    title: 'Report Name',
    dataIndex: 'planName',
    render: (text) => <a>{text}</a>,
  },
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

const AppTable = styled(Table)<{ theme?: Theme }>`
  // highlight selected row
  .clickRowStyl {
    background-color: ${(props) => (props.theme === Theme.light ? '#f6efff' : '#171528')};
  }
  .ant-table-tbody > tr > td.ant-table-cell-row-hover {
    background-color: ${(props) =>
      props.theme === Theme.light ? '#f6efff88' : '#17152888'}!important;
  }
`;

const Results: FC<{
  appId?: string;
  defaultSelectFirst?: boolean;
  onSelectedPlanChange: (selectedPlan: PlanStatistics) => void;
}> = ({ appId, defaultSelectFirst, onSelectedPlanChange }) => {
  const theme = useStore((state) => state.theme);
  const [selectRow, setSelectRow] = useState<number>(defaultSelectFirst ? 0 : -1);
  const { data: planStatistics } = useRequest(
    () =>
      ReplayService.queryPlanStatistics({
        appId,
        needTotal: true,
        pageSize: 100,
        pageIndex: 1,
      }),
    {
      ready: !!appId,
      refreshDeps: [appId],
      onSuccess(res) {
        res.length && defaultSelectFirst && onSelectedPlanChange(res[0]);
      },
    },
  );
  return (
    <div>
      <AppTable
        size='small'
        theme={theme}
        pagination={false}
        columns={columns}
        onRow={(record, index) => {
          return {
            onClick: () => {
              if (typeof index === 'number') {
                setSelectRow(index);
                onSelectedPlanChange(record as PlanStatistics);
              }
            },
          };
        }}
        rowClassName={(record, index) => (index === selectRow ? 'clickRowStyl' : '')}
        dataSource={planStatistics}
      />
    </div>
  );
};

export default Results;
