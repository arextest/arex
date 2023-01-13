import { useRequest } from 'ahooks';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ReplayService from '../../../services/Replay.service';
import { ReplayCase } from '../../../services/Replay.type';
import { HighlightRowTable, SmallTextButton } from '../../styledComponents';

type CaseProps = {
  planItemId: number;
  onClick?: (record: ReplayCase) => void;
  onClickSaveCase?: (record: ReplayCase) => void;
};

const CaseTable: FC<CaseProps> = (props) => {
  const { t } = useTranslation(['components']);

  const columnsCase: ColumnsType<ReplayCase> = [
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
      render: (_, record) => (
        <Tag color={['green', 'red', 'blue'][record.diffResultCode]}>
          {[t('replay.success'), t('replay.failed'), t('replay.invalid')][record.diffResultCode]}
        </Tag>
      ),
    },
    {
      title: t('replay.action'),
      render: (_, record) => [
        // <SmallTextButton key='replayLog' title='Replay Log' />,
        <SmallTextButton
          key='detail'
          title={t('replay.detail')}
          onClick={() => props.onClick && props.onClick(record)}
        />,
        <SmallTextButton
          key='save'
          title={t('replay.save')}
          onClick={() => props.onClickSaveCase && props.onClickSaveCase(record)}
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
    />
  );
};

export default CaseTable;
