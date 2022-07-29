import { useRequest, useToggle } from 'ahooks';
import { Col, Drawer, Row, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { FC, useState } from 'react';

import ReplayService from '../../api/Replay.service';
import { CategoryStatistic, Difference } from '../../api/Replay.type';
import { MenuSelect } from '../index';
import { SmallTextButton, TableWrapper } from '../styledComponents';

const Analysis: FC<{ planItemId: number }> = ({ planItemId }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryStatistic>();
  const [visibleScene, { toggle: toggleVisibleScene }] = useToggle(false);
  const { data: differenceData = [] } = useRequest(
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
    },
    {
      title: 'Scene Count',
      dataIndex: 'sceneCount',
    },
    {
      title: 'Case Count',
      dataIndex: 'caseCount',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <SmallTextButton title='Scenes' onClick={() => toggleVisibleScene()} />
      ),
    },
  ];

  return (
    <Row style={{ padding: '0 8px' }} gutter={8}>
      <Col span={6}>
        <MenuSelect<CategoryStatistic>
          defaultSelectFirst
          rowKey='operationName'
          onSelect={setSelectedCategory}
          placeholder='applicationsMenu.appFilterPlaceholder'
          request={() => ReplayService.queryResponseTypeStatistic({ planItemId })}
          filter={(keyword: string, app: CategoryStatistic) => app.operationName.includes(keyword)}
          itemRender={(item: CategoryStatistic) => ({
            label: item.operationName,
            key: item.operationName,
          })}
        />
      </Col>

      <Col span={18}>
        <TableWrapper>
          <Table
            columns={categoryColumns}
            dataSource={differenceData}
            pagination={false}
            size='small'
          />
        </TableWrapper>
      </Col>

      <Drawer title='Diff Detail' visible={visibleScene} onClose={toggleVisibleScene}>
        {/* TODO */}Scene content
      </Drawer>
    </Row>
  );
};

export default Analysis;
