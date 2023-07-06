import { useRequest } from 'ahooks';
import { Select, Space, Table, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { FC, useState } from 'react';

import { useTranslation } from '../../hooks';
import { BizLogLevel, BizLogType } from './constant';
import { BizLog, QueryPlanLogsReq, QueryPlanLogsRes } from './type';

const bizLogLevelOption = Object.entries(BizLogLevel).map(([label, value]) => ({ label, value }));
const bizLogTypeOption = Object.entries(BizLogType).map(([label, value]) => ({ label, value }));

const columns: ColumnsType<BizLog> = [
  {
    dataIndex: 'level',
    title: 'Level',
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
  const { t } = useTranslation();
  const [bizLogLevel, setBizLogLevel] = useState([]);
  const [bizLogType, setBizLogType] = useState([]);

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
          levels: bizLogLevel,
          types: bizLogType,
          pageNum: pagination.current as number,
          pageSize: pagination.pageSize as number,
        },
      }),
    {
      onSuccess(res) {
        setTotal(res?.total || 0);
      },
      refreshDeps: [bizLogLevel, bizLogType, pagination, props.planId],
    },
  );

  return (
    <>
      <Space style={{ marginBottom: '8px' }}>
        <Select
          showSearch
          optionFilterProp='label'
          mode={'multiple'}
          placeholder={t('replayLogs.levelFilterPlaceholder')}
          options={bizLogLevelOption}
          value={bizLogLevel}
          onChange={setBizLogLevel}
          style={{ width: '240px' }}
        />

        <Select
          showSearch
          optionFilterProp='label'
          mode='multiple'
          placeholder={t('replayLogs.typeFilterPlaceholder')}
          options={bizLogTypeOption}
          value={bizLogType}
          onChange={setBizLogType}
          style={{ width: '240px' }}
        />
      </Space>

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
    </>
  );
};

export default ReplayLogs;
