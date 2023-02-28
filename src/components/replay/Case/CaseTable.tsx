import { useRequest } from 'ahooks';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { useCustomNavigate } from '../../../router/useCustomNavigate';
import { useCustomSearchParams } from '../../../router/useCustomSearchParams';
import ReplayService from '../../../services/Replay.service';
import { ReplayCase } from '../../../services/Replay.type';
import { HighlightRowTable, SmallTextButton } from '../../styledComponents';

type CaseProps = {
  planItemId: string;
  onClick?: (record: ReplayCase) => void;
  onClickSaveCase?: (record: ReplayCase) => void;
};

const CaseTable: FC<CaseProps> = (props) => {
  const { t } = useTranslation(['components']);
  const customNavigate = useCustomNavigate();
  const customSearchParams = useCustomSearchParams();
  const location = useLocation();

  useEffect(() => {
    // customNavigate({
    //   path: location.pathname,
    //   query: {
    //     data: customSearchParams.query.data,
    //     planItemId: props.planItemId,
    //   },
    // });
  }, [props.planItemId]);

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
        // <SmallTextButton key='replayLog' title='Replay Log' />,
        <SmallTextButton
          key='save'
          title={t('replay.save')}
          onClick={() => props.onClickSaveCase?.(record)}
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
