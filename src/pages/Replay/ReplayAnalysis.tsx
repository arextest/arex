import './ReplayAnalysis.less';

import styled from '@emotion/styled';
import { Card, Space } from 'antd';
import { FC, useEffect, useState } from 'react';

import { Analysis } from '../../components/replay';
import DiffJsonView from '../../components/replay/DiffJsonView';
import { CollapseTable, PanesTitle } from '../../components/styledComponents';
import ReplayService from '../../services/Replay.service';
import { CategoryStatistic, Difference, PlanItemStatistics } from '../../services/Replay.type';

const ReplayAnalysis: FC<{ data: PlanItemStatistics }> = ({ data }) => {
  const [selectedDiff, setSelectedDiff] = useState<Difference>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryStatistic>();
  const [sences, setSences] = useState([]);
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
        setSences(s);
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

  const SmallCard = styled.div`
    border: 1px solid silver;
    cursor: pointer;
    padding: 24px;
    border-radius: 2px;
    margin-top: 24px;
    &:hover {
      border: 1px solid #603be3;
    }
  `;
  const diffMap = {
    '0': 'Unknown',
    '3': 'Difference node',
    '2': 'One more node than',
  };
  return (
    <Space direction='vertical' style={{ display: 'flex' }}>
      <PanesTitle title={<span>Main Service API: {data.operationName}</span>} />
      <CollapseTable
        active={!!selectedDiff}
        table={<Analysis planItemId={data.planItemId} onScenes={handleScenes} />}
        panel={
          <Card bordered={false} title='Diff Card' bodyStyle={{ padding: '8px 16px' }}>
            {diffs.map((diff, index) => {
              return (
                <Card
                  style={{ marginBottom: '8px', border: '1px solid #603be3', cursor: 'pointer' }}
                  onClick={() => {
                    setDiffJsonViewData({
                      baseMsg: diff.baseMsg,
                      testMsg: diff.testMsg,
                      logs: diff.logs,
                    });
                    setDiffJsonViewVisible(true);
                  }}
                >
                  {diff.logs.map((log) => {
                    return (
                      <div>
                        <p>Unmatched Type: {diffMap[log.pathPair.unmatchedType]}</p>
                        <p>Path: {log.path}</p>
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
