import { useRequest } from 'ahooks';
import { theme, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useRef, useState } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import ReplayService from '../../services/Replay.service';
import { PlanStatistics } from '../../services/Replay.type';
import { FullHeightSpin } from '../styledComponents';
import HighlightRowTable, { HighlightRowTableProps } from '../styledComponents/HighlightRowTable';
import StatusTag from './StatusTag';

const PageSize = 5 as const;

export type ResultsProps = {
  appId?: string;
  refreshDep?: React.Key;
  onSelectedPlanChange: (selectedPlan: PlanStatistics) => void;
} & Pick<HighlightRowTableProps<PlanStatistics>, 'defaultSelectFirst'>;

const ReplayTable: FC<ResultsProps> = (props) => {
  const { appId, refreshDep, defaultSelectFirst, onSelectedPlanChange } = props;

  const { token } = theme.useToken();
  const { t } = useTranslation(['components']);
  const [search] = useSearchParams();

  const [init, setInit] = useState(true);
  const [defaultPagination, setDefaultPagination] = useState({
    defaultCurrent: 1,
    defaultRow: 0,
  });

  const prevAppId = useRef<string>();

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
      title: t('replay.replayEndTime'),
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
      pollingInterval: 5000,
      onSuccess(res) {
        // 判断请求类型为轮询还是手动触发
        if (prevAppId.current !== appId) {
          // 判断 url 参数中是否含有 planId
          const searchResIndex = res.findIndex((i) => i.planId === search.get('planId'));
          if (searchResIndex >= 0) {
            onSelectedPlanChange(res[searchResIndex]);
            setDefaultPagination({
              defaultCurrent: Math.ceil((searchResIndex + 1) / PageSize),
              defaultRow: searchResIndex % PageSize,
            });
          } else {
            res.length && defaultSelectFirst && onSelectedPlanChange(res[0]);
          }
          prevAppId.current = appId;
        }
        res.every((record) => record.status !== 1) && cancelPollingInterval();

        init && setInit(false); // 设置第一次初始化标识
      },
    },
  );

  return (
    <FullHeightSpin
      spinning={init}
      minHeight={240}
      // 为了 defaultCurrent 和 defaultRow 生效，需在初次获取到数据后再挂载子组件
      // TODO 优化: Table Pagination 受控，直接挂载 Table
      mountOnFirstLoading={false}
    >
      <HighlightRowTable<PlanStatistics>
        rowKey='planId'
        size='small'
        loading={loading}
        pagination={{ defaultCurrent: defaultPagination.defaultCurrent, pageSize: PageSize }}
        columns={columns}
        defaultSelectFirst={defaultSelectFirst}
        onRowClick={onSelectedPlanChange}
        dataSource={planStatistics}
        defaultCurrent={defaultPagination.defaultCurrent}
        defaultRow={defaultPagination.defaultRow}
        sx={{
          '.ant-table-cell-ellipsis': {
            color: token.colorPrimary,
          },
        }}
      />
    </FullHeightSpin>
  );
};

export default ReplayTable;
