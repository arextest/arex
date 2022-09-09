import './ReplayAnalysis.less';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Card, Space, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

import { Analysis } from '../../components/replay';
import DiffJsonView from '../../components/replay/DiffJsonView';
import { CollapseTable, PanesTitle } from '../../components/styledComponents';
import ReplayService from '../../services/Replay.service';
import { CategoryStatistic, Difference, PlanItemStatistics } from '../../services/Replay.type';

const ReplayAnalysis: FC<{ data: PlanItemStatistics }> = ({ data }) => {
  const [selectedDiff, setSelectedDiff] = useState<Difference>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryStatistic>();
  const [diffs, setDiffs] = useState([]);
  const [diffJsonViewData, setDiffJsonViewData] = useState({});
  const [diffJsonViewVisible, setDiffJsonViewVisible] = useState(false);

  const closeDiffJsonView = () => {
    setDiffJsonViewVisible(false);
  };

  const handleScenes = (diff: Difference, category?: CategoryStatistic) => {
    if (selectedDiff?.differenceName !== diff.differenceName) {
      setSelectedDiff(diff);
      setSelectedCategory(category);
    } else {
      // setSelectedDiff(undefined);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      ReplayService.queryScenes({
        categoryName: selectedCategory!.categoryName,
        differenceName: selectedDiff!.differenceName,
        operationName: selectedCategory!.operationName,
        planItemId: data.planItemId.toString(),
      }).then((s) => {
        const arr = [];
        for (let i = 0; i < s.length; i++) {
          const sence = s[i];
          arr.push(
            ReplayService.queryMsgWithDiff({
              compareResultId: sence.compareResultId,
              logIndexes: sence.logIndexes,
            }),
          );
        }
        Promise.all(arr).then((d) => {
          setDiffs(d);
        });
      });
    }
  }, [selectedCategory, selectedDiff, data.planItemId]);

  const diffMap = {
    '0': {
      text: 'Unknown',
      color: 'red',
    },
    '1': {
      text: 'LEFT_MISSING',
      color: '#00bb74',
    },
    '3': {
      text: 'UNMATCHED',
      color: '#FFC0CB',
    },
    '2': {
      text: 'RIGHT_MISSING',
      color: '#00bb74',
    },
  };
  return (
    <Space direction='vertical' style={{ display: 'flex' }}>
      <PanesTitle title={<span>Main Service API: {data.operationName}</span>} />
      <CollapseTable
        active={!!selectedDiff}
        table={<Analysis planItemId={data.planItemId} onScenes={handleScenes} />}
        panel={
          <Card bordered={false} title='' bodyStyle={{ padding: '8px 16px' }}>
            {diffs
              .filter((i) => i.diffResultCode !== 2)
              .map((diff, index) => {
                return (
                  <Card
                    style={{ marginBottom: '8px', border: '1px solid #434343', cursor: 'pointer' }}
                    onClick={() => {
                      setDiffJsonViewData({
                        baseMsg: diff.baseMsg,
                        testMsg: diff.testMsg,
                        logs: diff.logs,
                      });
                      setDiffJsonViewVisible(true);
                    }}
                  >
                    <div
                      css={css`
                        margin-bottom: 8px;
                      `}
                    >
                      <span>Diff Card - {diff.logs.length} issues</span>
                      <Button size={'small'}>Tree Mode</Button>
                    </div>
                    {diff.logs.map((i, index) => {
                      return (
                        <div
                          key={index}
                          css={css`
                            display: flex;
                          `}
                        >
                          <Tag color={diffMap[i.pathPair.unmatchedType]?.color}>
                            {diffMap[i.pathPair.unmatchedType]?.text}
                          </Tag>
                          <span
                            css={css`
                              display: flex;
                              align-items: center;
                              //width: 100%;
                            `}
                          >
                            Value of {i.path} is different | excepted[
                            <span
                              css={css`
                                color: red;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                max-width: 200px;
                              `}
                            >
                              {i.baseValue}
                            </span>
                            ]. actual[
                            <span
                              css={css`
                                color: red;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                max-width: 200px;
                              `}
                            >
                              {i.testValue}
                            </span>
                            ].
                          </span>
                        </div>
                      );
                    })}
                  </Card>
                );
              })}
            {diffJsonViewVisible ? (
              <DiffJsonView
                visible={diffJsonViewVisible}
                onClose={closeDiffJsonView}
                data={diffJsonViewData}
              />
            ) : null}
          </Card>
        }
      />
    </Space>
  );
};

export default ReplayAnalysis;
