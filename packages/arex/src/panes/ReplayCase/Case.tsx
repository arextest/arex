import { HighlightRowTable, SmallTextButton, useTranslation } from '@arextest/arex-core';
import { usePagination } from 'ahooks';
import { TableProps, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, Key, useMemo } from 'react';

import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ReportService } from '@/services';
import { ReplayCaseType } from '@/services/ReportService';
import { generateId } from '@/utils';

export type CaseProps = {
  planItemId: string;
  filter?: Key;
  onClick?: (record: ReplayCaseType) => void;
  onChange?: TableProps<ReplayCaseType>['onChange'];
  onClickSaveCase?: (record: ReplayCaseType) => void;
  onClickRerunCase?: (recordId: string) => void;
};

const Case: FC<CaseProps> = (props) => {
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
      render: (recordId, record) => <a onClick={() => props.onClick?.(record)}>{recordId}</a>,
    },
    {
      title: t('replay.replayId'),
      dataIndex: 'replayId',
    },
    {
      title: t('replay.status'),
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
      render: (_, record) => [
        <SmallTextButton
          key='save'
          color={'primary'}
          title={t('replay.save') as string}
          onClick={(e) => {
            e.stopPropagation();
            props.onClickSaveCase?.(record);
          }}
        />,
        <SmallTextButton
          color='primary'
          key='caseDebug'
          title={t('replay.debug') as string}
          onClick={() => {
            navPane({
              type: PanesType.REQUEST,
              id: generateId(12),
              icon: 'Get',
              name: record.recordId,
              data: {
                recordId: record.recordId,
              },
            });
          }}
        />,
        <SmallTextButton
          color='primary'
          key='caseDetail'
          title={t('replay.recordDetail') as string}
          onClick={(e) => {
            e.stopPropagation();
            navPane({ type: PanesType.CASE_DETAIL, id: record.recordId, data: record });
          }}
        />,
        <SmallTextButton
          key='rerun'
          color={'primary'}
          title={t('replay.rerun') as string}
          onClick={() => props.onClickRerunCase?.(record.recordId)}
        />,
      ],
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

export default Case;
