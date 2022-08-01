import { useRequest } from 'ahooks';
import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC } from 'react';

import ReplayService from '../../api/Replay.service';
import { ReplayCase } from '../../api/Replay.type';
import { SmallTextButton } from '../styledComponents';

type CaseProps = {
  planItemId: number;
};

const columnsCase: ColumnsType<ReplayCase> = [
  {
    title: 'Record ID',
    dataIndex: 'recordId',
  },
  {
    title: 'Replay ID',
    dataIndex: 'replayId',
  },
  {
    title: 'Status',
    render: (_, record) => (
      <Tag color={record.diffResultCode ? 'error' : 'success'}>
        {record.diffResultCode ? 'Failed' : 'Success'}
      </Tag>
    ),
  },
  {
    title: 'Action',
    render: (_, record) => [
      <SmallTextButton key='replayLog' title='Replay Log' />,
      <SmallTextButton key='detail' title='Detail' />,
    ],
  },
];
const Case: FC<CaseProps> = ({ planItemId }) => {
  const { data: caseData = [] } = useRequest(() => ReplayService.queryReplayCase({ planItemId }), {
    ready: !!planItemId,
    refreshDeps: [planItemId],
    cacheKey: 'queryReplayCase',
  });
  return <Table columns={columnsCase} dataSource={caseData} pagination={false} />;
};

export default Case;
