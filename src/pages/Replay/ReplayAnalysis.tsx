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
const diffMap = {
  '0': {
    text: 'Unknown',
    color: 'red',
  },
  '1': {
    text: 'Left Missing',
    color: '#faad14',
    desc: 'is missing on the left',
  },
  '3': {
    text: 'Different Value',
    color: '#FFC0CB',
  },
  '2': {
    text: 'Right Missing',
    color: '#faad14',
    desc: 'is missing on the right',
  },
};
const BolderUnderlineSpan = styled.span`
  font-weight: bolder;
  margin: 0 10px;
  text-decoration: underline;
`;
function DiffLog({ i }) {
  if (i.pathPair.unmatchedType === 3) {
    return (
      <span
        css={css`
          display: flex;
          align-items: center;
          //width: 100%;
        `}
      >
        Value of
        <BolderUnderlineSpan>&#123;{i.path}&#125;</BolderUnderlineSpan>
        is different | excepted[
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
    );
  } else {
    return (
      <span>
        <BolderUnderlineSpan>&#123;{i.path}&#125;</BolderUnderlineSpan>
        {diffMap[[i.pathPair.unmatchedType]].desc}
      </span>
    );
  }
}

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
                  >
                    <div
                      css={css`
                        margin-bottom: 8px;
                      `}
                    >
                      <span
                        css={css`
                          margin-right: 8px;
                        `}
                      >
                        Diff Card - {diff.logs.length} issue(s)
                      </span>
                      <Button
                        size={'small'}
                        onClick={() => {
                          setDiffJsonViewData({
                            baseMsg: diff.baseMsg,
                            testMsg: diff.testMsg,
                            logs: diff.logs,
                          });
                          setDiffJsonViewVisible(true);
                        }}
                      >
                        Tree Mode
                      </Button>
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
                          <DiffLog i={i} />
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
