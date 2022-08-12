import { useRequest } from 'ahooks';
import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { FC, useState } from 'react';

import ReplayService from '../../services/Replay.service';
import { CategoryStatistic, Difference } from '../../services/Replay.type';
import { MenuSelect } from '../index';
import { SmallTextButton, TableWrapper } from '../styledComponents';

const Analysis: FC<{
  planItemId: number;
  onScenes?: (diff: Difference, category?: CategoryStatistic) => void;
}> = ({ planItemId, onScenes }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryStatistic>();
  const { data: differenceData = [], loading } = useRequest(
    () =>
      ReplayService.queryDifferences({
        categoryName: selectedCategory!.categoryName,
        operationName: selectedCategory!.operationName,
        planItemId,
      }),
    {
      ready: !!selectedCategory,
      refreshDeps: [selectedCategory],
    },
  );

  const categoryColumns: ColumnsType<Difference> = [
    {
      title: 'Point of difference',
      dataIndex: 'differenceName',
      ellipsis: true,
    },
    {
      title: 'Scene Count',
      dataIndex: 'sceneCount',
      width: '110px',
    },
    {
      title: 'Case Count',
      dataIndex: 'caseCount',
      width: '110px',
    },
    {
      title: 'Action',
      align: 'center',
      width: '80px',
      render: (_, record) => (
        <SmallTextButton
          title='Scenes'
          onClick={() => onScenes && onScenes(record, selectedCategory)}
        />
      ),
    },
  ];

  return (
    <Row style={{ padding: '8px' }} gutter={8}>
      <Col span={6}>
        <MenuSelect<CategoryStatistic>
          small
          defaultSelectFirst
          rowKey='operationName'
          onSelect={setSelectedCategory}
          placeholder='applicationsMenu.appFilterPlaceholder'
          request={() => ReplayService.queryResponseTypeStatistic({ planItemId })}
          filter='operationName'
          itemRender={(item: CategoryStatistic) => ({
            label: item.operationName,
            key: item.operationName,
          })}
          sx={`
            padding: 0;
          `}
        />
      </Col>

      <Col span={18}>
        <TableWrapper>
          <Table
            loading={loading}
            rowKey='differenceName'
            columns={categoryColumns}
            dataSource={differenceData}
            pagination={false}
            size='small'
          />
        </TableWrapper>
      </Col>
    </Row>
  );
};

export default Analysis;
