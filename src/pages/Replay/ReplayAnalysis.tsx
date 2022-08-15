import './ReplayAnalysis.less';

import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Card, Col, Row, Space } from 'antd';
import JSONEditor from 'jsoneditor';
import _ from 'lodash';
import { FC, useEffect, useState } from 'react';

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

  // TODO 使用工具函数 utils/tryParseJsonString
  function strConvertToJson(str: string) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {
        content: str,
      };
    }
  }

  useEffect(() => {
    const containerLeft = document.getElementById('containerLeft');
    const containerRight = document.getElementById('containerRight');
    if (selectedDiff && msgWithDiff && containerLeft && containerRight) {
      setTimeout(() => {
        containerLeft.innerHTML = '';
        containerRight.innerHTML = '';
        function onClassName({ path }) {
          const leftValue = _.get(jsonRight, path);
          const rightValue = _.get(jsonLeft, path);
          return _.isEqual(leftValue, rightValue) ? 'the_same_element' : 'different_element';
        }
        const optionsLeft = {
          mode: 'tree',
          onClassName: onClassName,
          onChangeJSON: function (j) {
            jsonLeft = j;
            window.editorRight.refresh();
          },
        };
        const optionsRight = {
          mode: 'tree',
          onClassName: onClassName,
          onChangeJSON: function (j) {
            jsonRight = j;
            window.editorLeft.refresh();
          },
        };
        let jsonLeft = strConvertToJson(msgWithDiff?.baseMsg);
        let jsonRight = strConvertToJson(msgWithDiff?.testMsg);
        window.editorLeft = new JSONEditor(containerLeft, optionsLeft, jsonLeft);
        window.editorRight = new JSONEditor(containerRight, optionsRight, jsonRight);
      }, 200);
    }
  }, [selectedDiff, msgWithDiff]);

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
                {/*{msgWithDiff && [*/}
                {/*  <p>left: {JSON.stringify(msgWithDiff?.baseMsg)}</p>,*/}
                {/*  <p>right: {msgWithDiff?.testMsg}</p>,*/}
                {/*]}*/}
                <div>
                  <div
                    css={css`
                      display: flex;
                      justify-content: space-between;
                    `}
                  >
                    <div className='MsgWithDiffLegend'>
                      <div>
                        <div className='color-tag-green'></div>
                        <span>One more node than</span>
                      </div>
                      <div>
                        <div className='color-tag-pink'></div>
                        <span>Difference node</span>
                      </div>
                      <div>
                        <div className='color-tag-grey'></div>
                        <span>Ignore node</span>
                      </div>
                    </div>
                  </div>
                  <div id='MsgWithDiffJsonEditorWrapper'>
                    <div id='containerLeft'></div>
                    <div id='containerRight'></div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        }
      />
    </Space>
  );
};

export default ReplayAnalysis;
