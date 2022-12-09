import { useRequest } from 'ahooks';
import { Col, Row, theme } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { FC, useState } from 'react';

import ReplayService from '../../services/Replay.service';
import { CategoryStatistic, Difference } from '../../services/Replay.type';
import { MenuSelect } from '../index';
import { HighlightRowTable } from '../styledComponents';

const Analysis: FC<{
  planItemId: number;
  onScenes?: (diff: Difference, category?: CategoryStatistic) => void;
  onSelectCategory?: (category: CategoryStatistic) => void;
}> = ({ planItemId, onScenes, onSelectCategory }) => {
  const { token } = theme.useToken();

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

  const handleSelect = (item: CategoryStatistic) => {
    onSelectCategory && onSelectCategory(item);
    setSelectedCategory(item);
  };

  const handleRowClick = (record: Difference) => onScenes && onScenes(record, selectedCategory);

  return (
    <Row gutter={16}>
      <Col span={6} style={{ borderRight: `1px solid ${token.colorBorder}` }}>
        <MenuSelect<CategoryStatistic>
          small
          forceFilter
          defaultSelectFirst
          rowKey='operationName'
          onSelect={handleSelect}
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
          rowKey='differenceName'
          columns={categoryColumns}
          dataSource={differenceData}
          onRowClick={handleRowClick}
        />
      </Col>
    </Row>
  );
};

export default Analysis;
