import { useRequest } from 'ahooks';
import { Table, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { FC, useState } from 'react';

import { BizLogLevel } from './constant';
import { BizLog, QueryPlanLogsReq, QueryPlanLogsRes } from './type';

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
  request: (params: QueryPlanLogsReq) => Promise<QueryPlanLogsRes>;
};

const ReplayLogs: FC<ReplayLogsProps> = (props) => {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 15,
  });
  const [total, setTotal] = useState(0);

  const { data, loading } = useRequest(
    () =>
      props.request({
        planId: props.planId,
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
      refreshDeps: [pagination, props.planId],
    },
  );

  return (
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
  );
};

export default ReplayLogs;
