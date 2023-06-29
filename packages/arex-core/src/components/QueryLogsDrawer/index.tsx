import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Drawer, Input, Select, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
const QueryLogsDrawer: FC<{
  show: boolean;
  request: (params: any) => any;
  onHideDrawer: () => void;
  planId: string;
}> = ({ show, request, onHideDrawer, planId }) => {
  const [bizLogLevel, setBizLogLevel] = useState([]);
  const [bizLogType, setBizLogType] = useState([]);
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const { data, loading } = useRequest(
    (params) =>
      request(
        params || {
          planId: planId,
          condition: {
            levels: bizLogLevel,
            types: bizLogType,
            pageNum: pagination.current,
            pageSize: pagination.pageSize,
          },
        },
      ),
    {
      onSuccess(res: { total?: number; logs: any }) {
        setTotal(res?.total || 0);
      },
      refreshDeps: [bizLogLevel, bizLogType, pagination, planId],
    },
  );

  const bizLogLevelOption = [
    { value: 0, label: 'INFO' },
    { value: 1, label: 'WARN' },
    { value: 2, label: 'ERROR' },
    { value: 3, label: 'DEBUG' },
  ];
  const bizLogTypeOption = [
    { value: 0, label: 'PLAN_START' },
    { value: 1, label: 'PLAN_CASE_SAVED' },
    { value: 2, label: 'PLAN_CONTEXT_BUILT' },
    { value: 3, label: 'PLAN_DONE' },
    { value: 4, label: 'PLAN_ASYNC_RUN_START' },
    { value: 5, label: 'PLAN_STATUS_CHANGE' },
    { value: 6, label: 'PLAN_FATAL_ERROR' },
    { value: 100, label: 'QPS_LIMITER_INIT' },
    { value: 101, label: 'QPS_LIMITER_CHANGE' },
    { value: 200, label: 'CONTEXT_START' },
    { value: 202, label: 'CONTEXT_AFTER_RUN' },
    { value: 203, label: 'CONTEXT_SKIP' },
    { value: 204, label: 'CONTEXT_NORMAL' },
    { value: 306, label: 'ACTION_ITEM_CASE_SAVED' },
    { value: 300, label: 'ACTION_ITEM_EXECUTE_CONTEXT' },
    { value: 302, label: 'ACTION_ITEM_INIT_TOTAL_COUNT' },
    { value: 303, label: 'ACTION_ITEM_STATUS_CHANGED' },
    { value: 304, label: 'ACTION_ITEM_SENT' },
    { value: 305, label: 'ACTION_ITEM_BATCH_SENT' },
    { value: 400, label: 'RESUME_START' },
  ];

  const columns = [
    {
      dataIndex: 'level',
      title: '等级',
      render(_: number): string {
        return bizLogLevelOption.find((b) => b.value === _)?.label || '';
      },
    },
    {
      dataIndex: 'logType',
      title: '类型',
      render(_: number): string {
        return bizLogTypeOption.find((b) => b.value === _)?.label || '';
      },
    },
    {
      dataIndex: 'message',
      title: '消息',
      ellipsis: true,
    },
    {
      dataIndex: 'resumedExecution',
      title: '继续执行',
      render(_: boolean) {
        return _ ? '是' : '否';
      },
    },
    {
      dataIndex: 'date',
      title: '时间',
      render(_: string) {
        return dayjs(_).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  return (
    <Drawer title={'log'} open={show} width={'85%'} onClose={onHideDrawer}>
      <Space
        css={css`
          margin-bottom: 10px;
        `}
      >
        <Select
          mode={'multiple'}
          placeholder={'请选择log等级'}
          value={bizLogLevel}
          onChange={(val) => {
            setBizLogLevel(val);
          }}
          css={css`
            width: 240px;
          `}
          options={bizLogLevelOption}
        />
        <Select
          mode={'multiple'}
          placeholder={'请选择log类型'}
          value={bizLogType}
          onChange={(val) => {
            setBizLogType(val);
          }}
          css={css`
            width: 240px;
          `}
          options={bizLogTypeOption}
        />
      </Space>

      <Table
        pagination={{
          ...pagination,
          total: total,
        }}
        onChange={(tpc: any) => {
          setPagination(tpc);
        }}
        size={'small'}
        columns={columns}
        dataSource={data?.logs || []}
        loading={loading}
      />
    </Drawer>
  );
};

export default QueryLogsDrawer;
