import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Drawer, Input, Select, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
export enum BizLogLevel {
  INFO,
  WARN,
  ERROR,
  DEBUG,
}

export enum BizLogType {
  PLAN_START = 0,
  PLAN_CASE_SAVED = 1,
  PLAN_CONTEXT_BUILT = 2,
  PLAN_DONE = 3,
  PLAN_ASYNC_RUN_START = 4,
  PLAN_STATUS_CHANGE = 5,
  PLAN_FATAL_ERROR = 6,

  QPS_LIMITER_INIT = 100,
  QPS_LIMITER_CHANGE = 101,

  CONTEXT_START = 200,
  CONTEXT_AFTER_RUN = 202,
  CONTEXT_SKIP = 203,
  CONTEXT_NORMAL = 204,

  ACTION_ITEM_CASE_SAVED = 306,
  ACTION_ITEM_EXECUTE_CONTEXT = 300,
  ACTION_ITEM_INIT_TOTAL_COUNT = 302,
  ACTION_ITEM_STATUS_CHANGED = 303,
  ACTION_ITEM_SENT = 304,
  ACTION_ITEM_BATCH_SENT = 305,

  RESUME_START = 400,
}

export type QueryPlanLogsReq = {
  planId: string;
  condition: {
    levels?: BizLogLevel[];
    types?: BizLogType[];

    pageNum: number;
    pageSize: number;
  };
};

export type QueryPlanLogsRes = {
  logs: BizLog[];
  planId: string;
  total: number;
};
export type BizLog = {
  date: string;
  level: BizLogLevel;
  message: string;
  logType: number;

  planId: string;
  resumedExecution: boolean;
  contextName: string;

  contextIdentifier: string;
  caseItemId: string;
  actionItemId: string;
  operationName: string;

  exception: string;
  request: string;
  response: string;
  traceId: string;
  extra: string;
};
const QueryLogsDrawer: FC<{
  show: boolean;
  request: (params: QueryPlanLogsReq) => Promise<QueryPlanLogsRes>;
  onHideDrawer: () => void;
  planId: string;
}> = ({ show, request, onHideDrawer, planId }) => {
  const [bizLogLevel, setBizLogLevel] = useState([]);
  const [bizLogType, setBizLogType] = useState([]);
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });
  useEffect(() => {
    if (show) {
      setPagination({
        ...pagination,
        current: 1,
      });
    }
  }, [show]);
  const [total, setTotal] = useState(0);
  const { data, loading } = useRequest(
    () =>
      request({
        planId: planId,
        condition: {
          levels: bizLogLevel,
          types: bizLogType,
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
        },
      }),
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
      title: 'Level',
      render(_: number): string {
        return bizLogLevelOption.find((b) => b.value === _)?.label || '';
      },
    },
    {
      dataIndex: 'logType',
      title: 'Type',
      render(_: number): string {
        return bizLogTypeOption.find((b) => b.value === _)?.label || '';
      },
    },
    {
      dataIndex: 'message',
      title: 'Message',
      ellipsis: true,
    },
    // {
    //   dataIndex: 'resumedExecution',
    //   title: '继续执行',
    //   render(_: boolean) {
    //     return _ ? '是' : '否';
    //   },
    // },
    {
      dataIndex: 'date',
      title: 'Time',
      render(_: string) {
        return dayjs(_).format('YYYY-MM-DD HH:mm:ss');
      },
      sorter: (a: { date: string }, b: { date: string }) =>
        dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1,
    },
  ];

  return (
    <Drawer title={'Logs'} open={show} width={'85%'} onClose={onHideDrawer}>
      <Space
        css={css`
          margin-bottom: 10px;
        `}
      >
        <Select
          mode={'multiple'}
          placeholder={'Please select a log level'}
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
          placeholder={'Please select a log type'}
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
