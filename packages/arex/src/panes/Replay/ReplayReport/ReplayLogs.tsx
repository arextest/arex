import { PaneDrawer, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { DrawerProps, Table, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { FC, useState } from 'react';

import { ScheduleService } from '@/services';
import { BizLog } from '@/services/ScheduleService';

const BizLogLevel = {
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  // DEBUG: 3,
} as const;

const bizLogLevelOption = Object.entries(BizLogLevel).map(([label, value]) => ({ label, value }));

const columns: ColumnsType<BizLog> = [
  {
    dataIndex: 'level',
    title: 'Level',
    filters: [
      {
        text: 'INFO',
        value: BizLogLevel.INFO,
      },
      {
        text: 'WARN',
        value: BizLogLevel.WARN,
      },
      {
        text: 'ERROR',
        value: BizLogLevel.ERROR,
      },
    ],
    onFilter: (value, record) => record.level === Number(value),
    render: (level) => bizLogLevelOption.find((b) => b.value === level)?.label || '',
  },
  {
    dataIndex: 'message',
    title: 'Message',
  },
  {
    dataIndex: 'date',
    title: 'Time',
    render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    sorter: (a, b) => (dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1),
  },
];

export type ReplayLogsProps = {
  planId: string;
} & DrawerProps;

const ReplayLogs: FC<ReplayLogsProps> = (props) => {
  const { planId, ...restProps } = props;

  const { t } = useTranslation('components');

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 15,
  });
  const [total, setTotal] = useState(0);

  const { data, loading } = useRequest(
    () =>
      ScheduleService.queryLogs({
        planId,
        condition: {
          levels: [BizLogLevel.INFO, BizLogLevel.WARN, BizLogLevel.ERROR],
          pageNum: pagination.current as number,
          pageSize: pagination.pageSize as number,
        },
      }),
    {
      onSuccess(res) {
        setTotal(res?.total || 0);
      },
      refreshDeps: [pagination, planId],
      ready: props.open,
    },
  );

  return (
    <PaneDrawer destroyOnClose title={t('replay.executionLogs')} width={'75%'} {...restProps}>
      <Table
        size='small'
        pagination={{
          total,
          ...pagination,
        }}
        loading={loading}
        columns={columns}
        dataSource={data?.logs || []}
        onChange={setPagination}
      />
    </PaneDrawer>
  );
};

export default ReplayLogs;
