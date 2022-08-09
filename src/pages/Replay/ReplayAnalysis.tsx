import { useRequest } from 'ahooks';
import { Card, Col, Collapse, Row, Space } from 'antd';
import React, { FC, useState } from 'react';

import MenuSelect from '../../components/MenuSelect';
import Analysis from '../../components/replay/Analysis';
import CollapseTable from '../../components/styledComponents/CollapseTable';
import PanesTitle from '../../components/styledComponents/PanesTitle';
import ReplayService from '../../services/Replay.service';
import {
  CategoryStatistic,
  Difference,
  PlanItemStatistics,
  Scene,
} from '../../services/Replay.type';

const { Panel } = Collapse;

const ReplayAnalysis: FC<{ data: PlanItemStatistics }> = ({ data }) => {
  const [selectedDiff, setSelectedDiff] = useState<Difference>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryStatistic>();
  const handleScenes = (diff: Difference, category?: CategoryStatistic) => {
    console.log(diff, category);
    if (selectedDiff?.differenceName !== diff.differenceName) {
      setSelectedDiff(diff);
      setSelectedCategory(category);
    } else {
      setSelectedDiff(undefined);
    }
  };

  const { data: msgWithDiff, run: queryMsgWithDiff } = useRequest(ReplayService.queryMsgWithDiff, {
    manual: true,
    onSuccess(res) {
      console.log(res);
    },
  });

  const handleDiffChange = (scene: Scene) => {
    console.log(scene);
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
          <Card bordered={false} title='Diff Detail' bodyStyle={{ padding: '8px 0' }}>
            <Row>
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
