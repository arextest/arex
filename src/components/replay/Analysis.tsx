import { useRequest } from 'ahooks';
import { Col, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { FC, useState } from 'react';

import ReplayService from '../../services/Replay.service';
import { CategoryStatistic, Difference } from '../../services/Replay.type';
import { MenuSelect } from '../index';
import { HighlightRowTable } from '../styledComponents';

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
      render: (text, record) => <a onClick={() => handleRowClick(record)}>{text}</a>,
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
  ];

  const handleRowClick = (record: Difference) => onScenes && onScenes(record, selectedCategory);

  return (
    <Row style={{ padding: '8px' }} gutter={8}>
      <Col span={6}>
        <MenuSelect<CategoryStatistic>
          small
          forceFilter
          defaultSelectFirst
          rowKey='operationName'
          onSelect={setSelectedCategory}
          placeholder={''}
          request={() => ReplayService.queryResponseTypeStatistic({ planItemId })}
          filter={(keyword, record) =>
            record.errorCaseCount + record.failCaseCount > 0 &&
            record.operationName.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
          }
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
        <HighlightRowTable
          size='small'
          loading={loading}
          pagination={false}
          rowKey='differenceName'
          columns={categoryColumns}
          dataSource={differenceData}
          onRowClick={handleRowClick}
          sx={{ margin: '-8px 0 0 8px' }}
        />
      </Col>
    </Row>
  );
};

export default Analysis;
