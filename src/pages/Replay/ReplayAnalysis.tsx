import './ReplayAnalysis.less';

import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Card, Col, Row, Space } from 'antd';
import JSONEditor from 'jsoneditor';
import { FC, useEffect, useRef, useState } from 'react';

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
  const containerLeftRef = useRef();
  const containerRightRef = useRef();
  const [selectedDiff, setSelectedDiff] = useState<Difference>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryStatistic>();
  const handleScenes = (diff: Difference, category?: CategoryStatistic) => {
    console.log('s');
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
    const containerLeft = containerLeftRef.current;
    const containerRight = containerRightRef.current;
    if (selectedDiff && msgWithDiff && containerLeft && containerRight) {
      setTimeout(() => {
        containerLeft.innerHTML = '';
        containerRight.innerHTML = '';
        function genAllDiffByType(logs) {
          const allDiff = {
            diff012: [],
            diff3: [],
            diff012Ig: [],
            diff3Ig: [],
          };
          for (let j = 0; j < logs.length; j++) {
            const leftArr = [];
            for (let i = 0; i < logs[j].pathPair.leftUnmatchedPath.length; i++) {
              leftArr.push(
                logs[j].pathPair.leftUnmatchedPath[i].nodeName
                  ? logs[j].pathPair.leftUnmatchedPath[i].nodeName
                  : logs[j].pathPair.leftUnmatchedPath[i].index,
              );
            }
            const rightArr = [];
            for (let i = 0; i < logs[j].pathPair.rightUnmatchedPath.length; i++) {
              rightArr.push(
                logs[j].pathPair.rightUnmatchedPath[i].nodeName
                  ? logs[j].pathPair.rightUnmatchedPath[i].nodeName
                  : logs[j].pathPair.rightUnmatchedPath[i].index,
              );
            }
            const unmatchedTypes = [0, 1, 2];
            if (logs[j].logTag.ig) {
              if (unmatchedTypes.includes(logs[j].pathPair.unmatchedType)) {
                allDiff.diff012Ig.push(leftArr.length > rightArr.length ? leftArr : rightArr);
              } else {
                allDiff.diff3Ig.push(leftArr);
                allDiff.diff3Ig.push(rightArr);
              }
            } else {
              if (unmatchedTypes.includes(logs[j].pathPair.unmatchedType)) {
                allDiff.diff012.push(leftArr.length > rightArr.length ? leftArr : rightArr);
              } else {
                allDiff.diff3.push(leftArr);
                allDiff.diff3.push(rightArr);
              }
            }
          }
          return allDiff;
        }
        const allDiffByType = genAllDiffByType(msgWithDiff.logs);
        function onClassName({ path }) {
          // 只能返回一种ClassName
          if (
            allDiffByType.diff012.map((item) => JSON.stringify(item)).includes(JSON.stringify(path))
          ) {
            return 'different_element_012';
          }
          if (
            allDiffByType.diff3.map((item) => JSON.stringify(item)).includes(JSON.stringify(path))
          ) {
            return 'different_element';
          }
        }
        const optionsLeft = {
          mode: 'view',
          theme: 'twitlighjt',
          onClassName: onClassName,
          onChangeJSON: function (j) {
            jsonLeft = j;
            window.editorRight.refresh();
          },
        };
        const optionsRight = {
          mode: 'view',
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
        window.editorLeft.expandAll();
        window.editorRight.expandAll();
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
                  requestOptions={{
                    refreshDeps: [selectedCategory, selectedDiff, data.planItemId],
                  }}
                  placeholder={''}
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
                    <div ref={containerLeftRef} id='containerLeft'></div>
                    <div ref={containerRightRef} id='containerRight'></div>
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
