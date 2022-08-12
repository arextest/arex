import { useRequest } from 'ahooks';
import { Card, Col, Row, Space } from 'antd';
import React, { FC, useState } from 'react';

import { MenuSelect } from '../../components';
import { Analysis } from '../../components/replay';
import { CollapseTable, PanesTitle } from '../../components/styledComponents';
import ReplayService from '../../services/Replay.service';
import {
  CategoryStatistic,
  Difference,
  PlanItemStatistics,
  Scene,
} from '../../services/Replay.type';

const ReplayAnalysis: FC<{ data: PlanItemStatistics }> = ({ data }) => {
  const [selectedDiff, setSelectedDiff] = useState<Difference>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryStatistic>();
  const handleScenes = (diff: Difference, category?: CategoryStatistic) => {
    if (selectedDiff?.differenceName !== diff.differenceName) {
      setSelectedDiff(diff);
      setSelectedCategory(category);
    } else {
      setSelectedDiff(undefined);
    }
  };

  const { data: msgWithDiff, run: queryMsgWithDiff } = useRequest(ReplayService.queryMsgWithDiff, {
    manual: true,
  });

  const handleDiffChange = (scene: Scene) => {
    queryMsgWithDiff({
      compareResultId: scene.compareResultId,
      logIndexes: scene.logIndexes,
    });
  };

  return (
    <Space direction='vertical' style={{ display: 'flex' }}>
      <PanesTitle title={<span>Main Service API: {data.operationName}</span>} />

      <CollapseTable
        active={!!selectedDiff}
        table={<Analysis planItemId={data.planItemId} onScenes={handleScenes} />}
        panel={
          <Card bordered={false} title='Diff Detail' bodyStyle={{ padding: '8px 16px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <MenuSelect<Scene>
                  small
                  defaultSelectFirst
                  rowKey='sceneName'
                  filter='sceneName'
                  onSelect={handleDiffChange}
                  request={() =>
                    ReplayService.queryScenes({
                      categoryName: selectedCategory!.categoryName,
                      differenceName: selectedDiff!.differenceName,
                      operationName: selectedCategory!.operationName,
                      planItemId: data.planItemId.toString(),
                    })
                  }
                />
              </Col>
              <Col span={18}>
                {msgWithDiff && [
                  <p>left: {JSON.stringify(msgWithDiff?.baseMsg)}</p>,
                  <p>right: {msgWithDiff?.testMsg}</p>,
                ]}
              </Col>
            </Row>
          </Card>
        }
      />
    </Space>
  );
};

export default ReplayAnalysis;
