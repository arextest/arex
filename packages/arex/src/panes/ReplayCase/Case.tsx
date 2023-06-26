import { HighlightRowTable, SmallTextButton, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, Key, useMemo } from 'react';

import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ReportService } from '@/services';
import { ReplayCaseType } from '@/services/ReportService';

type CaseProps = {
  planItemId: string;
  filter?: Key;
  onClick?: (record: ReplayCaseType) => void;
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

  const { data: caseData = [], loading } = useRequest(
    () => ReportService.queryReplayCase({ planItemId: props.planItemId }),
    {
      ready: !!props.planItemId,
      refreshDeps: [props.planItemId],
    },
  );

  return (
    <HighlightRowTable
      size='small'
      rowKey='recordId'
      loading={loading}
      columns={columnsCase}
      dataSource={caseData}
      pagination={{ pageSize: 5 }}
      onRowClick={props.onClick}
    />
  );
};

export default Case;
