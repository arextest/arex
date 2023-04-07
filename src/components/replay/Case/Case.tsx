import { useRequest } from 'ahooks';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ReplayService from '../../../services/Replay.service';
import { ReplayCase } from '../../../services/Replay.type';
import { HighlightRowTable, SmallTextButton } from '../../styledComponents';
import ToCaseDetailButton from '../ToCaseDetailButton';

type CaseProps = {
  planItemId: string;
  onClick?: (record: ReplayCase) => void;
  onClickSaveCase?: (record: ReplayCase) => void;
};

const Case: FC<CaseProps> = (props) => {
  const { t } = useTranslation(['components']);

  const columnsCase: ColumnsType<ReplayCase> = [
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
          title={t('replay.save')}
          onClick={() => props.onClickSaveCase?.(record)}
        />,
        <ToCaseDetailButton
          key='caseDetail'
          caseInfo={{
            appId: props.appId,
            planId: props.planId,
            recordId: record.recordId,
            replayId: record.replayId,
            operationId: props.operationId,
            operationName: props.operationName,
          }}
        />,
      ],
    },
  ];

  const { data: caseData = [], loading } = useRequest(
    () => ReplayService.queryReplayCase({ planItemId: props.planItemId }),
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
