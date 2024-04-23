import { HighlightRowTable, useArexPaneProps } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { Card, Input, Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { FC, useMemo } from 'react';

import ReplayCaseDetail from '@/panes/ReplayCaseDetail/ReplayCaseDetail';
import { decodePaneKey } from '@/store/useMenusPanes';

const mockData = [
  {
    id: 1,
    createdAt: 1713858443287,
    host: 'http://localhost:8080',
    endpoint: '/api/v1/traffic',
    tag: ['dev'],
    status: 1,
  },
  {
    id: 2,
    createdAt: 1713858333287,
    host: 'http://localhost:8082',
    endpoint: '/api/v2/traffic',
    tag: ['production'],
    status: 0,
  },
];
export type TrafficType = (typeof mockData)[number];

const TrafficList: FC = (props) => {
  const { paneKey } = useArexPaneProps();
  const { id: appId } = useMemo(() => decodePaneKey(paneKey), [paneKey]);

  const columns: ColumnType<TrafficType>[] = [
    {
      title: 'Creation Date',
      dataIndex: 'createdAt',
      render: (value: number) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Host',
      dataIndex: 'host',
    },
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      render: (tags: string[]) =>
        tags.map((tag) => (
          <Tag key={tag} title={tag}>
            {tag}
          </Tag>
        )),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: number) =>
        status === 1 ? <Tag color='success'>OK</Tag> : <Tag color='error'>ERROR</Tag>,
    },
  ];

  return (
    <Card
      title='Traffic List'
      extra={<Input.Search size='small' />}
      styles={{
        body: {
          padding: 0,
        },
      }}
      style={{ marginTop: '16px' }}
    >
      <HighlightRowTable
        rowKey='id'
        columns={columns}
        dataSource={mockData}
        expandable={{
          expandRowByClick: true,
          expandedRowRender: (record) => (
            // MOCK DATA
            <ReplayCaseDetail
              paneKey={paneKey}
              navigation={false}
              data={{ appId, recordId: 'AREX-172-19-0-4-565959669171' }}
            />
          ),
        }}
        css={css`
          .ant-table-row:hover {
            cursor: pointer;
          }
        `}
      />
    </Card>
  );
};

export default TrafficList;
