import { BugOutlined, SearchOutlined } from '@ant-design/icons';
import { HighlightRowTable, SmallTextButton, useTranslation } from '@arextest/arex-core';
import { usePagination } from 'ahooks';
import { TableProps, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, Key, useMemo } from 'react';

import { CollectionNodeType, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ReportService } from '@/services';
import { ReplayCaseType } from '@/services/ReportService';
import { useWorkspaces } from '@/store';
import { generateId } from '@/utils';

export type CaseProps = {
  appId: string;
  appName: string;
  planItemId: string;
  operationId: string;
  operationName: string | null;
  planId: string;
  filter?: Key;
  onClick?: (record: ReplayCaseType) => void;
  onChange?: TableProps<ReplayCaseType>['onChange'];
};

const CaseList: FC<CaseProps> = (props) => {
  const { activeWorkspaceId } = useWorkspaces();
  const { t } = useTranslation(['components']);

  const navPane = useNavPane();

  const filterMap = useMemo(
    () => [
      { text: t('replay.success'), value: 0 },
      { text: t('replay.failed'), value: 1 },
      { text: t('replay.invalid'), value: 2 },
    ],
    [t],
  );

  const columnsCase: ColumnsType<ReplayCaseType> = [
    {
      title: t('replay.recordId'),
      dataIndex: 'recordId',
    },
    {
      title: t('replay.replayId'),
      dataIndex: 'replayId',
    },
    {
      title: t('replay.status'),
      width: 100,
      defaultFilteredValue: props.filter !== undefined ? [props.filter.toString()] : undefined,
      filterMultiple: false,
      filters: filterMap,
      onFilter: (value, record) => record.diffResultCode === value,
      render: (_, record) => (
        <Tag color={['green', 'red', 'blue'][record.diffResultCode]}>
          {[t('replay.success'), t('replay.failed'), t('replay.invalid')][record.diffResultCode]}
        </Tag>
      ),
    },
    {
      title: t('replay.action'),
      width: 200,
      render: (_, record) => (
        <>
          <SmallTextButton
            key='caseDetail'
            icon={<SearchOutlined />}
            title={t('replay.recordDetail')}
            onClick={(e) => {
              e.stopPropagation();
              navPane({
                type: PanesType.CASE_DETAIL,
                id: record.recordId,
                data: {
                  appId: props.appId,
                  planId: props.planId,
                  recordId: record.recordId,
                  planItemId: props.planItemId,
                },
              });
            }}
          />
          <SmallTextButton
            key='case'
            icon={<BugOutlined />}
            title={t('replay.debug')}
            onClick={(e) => {
              e.stopPropagation();
              navPane({
                type: PanesType.REQUEST,
                id: `${activeWorkspaceId}-${CollectionNodeType.case}-${generateId(12)}`,
                // icon: 'Get',
                name: `Debug - ${record.recordId}`,
                data: {
                  recordId: record.recordId,
                  planId: props.planId,
                  appName: props.appName,
                  interfaceName: props.operationName,
                  operationId: props.operationId,
                },
              });
            }}
          />
        </>
      ),
    },
  ];

  const {
    data: { list: caseData } = { list: [] },
    pagination,
    loading,
  } = usePagination(
    (params) =>
      ReportService.queryReplayCase({
        pageIndex: params.current,
        pageSize: params.pageSize,
        planItemId: props.planItemId,
        diffResultCode: Number(props.filter),
        needTotal: true,
      }),
    {
      ready: !!props.planItemId,
      refreshDeps: [props.planItemId],
      defaultPageSize: 5,
    },
  );

  return (
    <HighlightRowTable
      size='small'
      rowKey='recordId'
      loading={loading}
      columns={columnsCase}
      dataSource={caseData}
      pagination={pagination}
      onRowClick={props.onClick}
      onChange={props.onChange}
    />
  );
};

export default CaseList;
