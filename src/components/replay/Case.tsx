import { useRequest } from 'ahooks';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC } from 'react';

import ReplayService from '../../services/Replay.service';
import { ReplayCase } from '../../services/Replay.type';
import { HighlightRowTable, SmallTextButton } from '../styledComponents';

type CaseProps = {
  planItemId: number;
  onClick?: (record: ReplayCase) => void;
  onClickSaveCase?: (record: ReplayCase) => void;
};

const Case: FC<CaseProps> = (props) => {
  const columnsCase: ColumnsType<ReplayCase> = [
    {
      title: 'Record ID',
      dataIndex: 'recordId',
    },
    {
      title: 'Index ID',
      dataIndex: 'replayId',
    },
    {
      title: 'Status',
      render: (_, record) => (
        <Tag color={['green', 'red', 'blue'][record.diffResultCode]}>
          {['Success', 'Failed', 'Invalid'][record.diffResultCode]}
        </Tag>
      ),
    },
    {
      title: 'Action',
      render: (_, record) => [
        // <SmallTextButton key='replayLog' title='Replay Log' />,
        <SmallTextButton
          key='detail'
          title='Detail'
          onClick={() => props.onClick && props.onClick(record)}
        />,
        <SmallTextButton
          key='save'
          title='Save'
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
      cacheKey: 'queryReplayCase',
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

export default Case;
