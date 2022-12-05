import './ReplayAnalysis.less';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useAsyncEffect } from 'ahooks';
import { Button, Card, Space, Tag } from 'antd';
import { FC, useState } from 'react';

import { Analysis } from '../components/replay';
import DiffJsonView, { DiffJsonViewProps } from '../components/replay/DiffJsonView';
import { CollapseTable, PanesTitle } from '../components/styledComponents';
import ReplayService from '../services/Replay.service';
import {
  CategoryStatistic,
  Difference,
  PlanItemStatistics,
  QueryMsgWithDiffLog,
  QueryMsgWithDiffRes,
} from '../services/Replay.type';
import { PageFC } from './index';

const diffMap: {
  [unmatchedType: string]: {
    text: string;
    color: string;
    desc?: string;
  };
} = {
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

const DiffLog: FC<{ log: QueryMsgWithDiffLog }> = (props) => {
  if (props.log.pathPair.unmatchedType === 3) {
    return (
      <span
        css={css`
          display: flex;
          align-items: center;
          //width: 100%;
        `}
      >
        Value of
        <BolderUnderlineSpan>&#123;{props.log.path}&#125;</BolderUnderlineSpan>
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
          {props.log.baseValue}
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
          {props.log.testValue}
        </span>
        ].
      </span>
    );
  } else {
    return (
      <span>
        <BolderUnderlineSpan>&#123;{props.log.path}&#125;</BolderUnderlineSpan>
        {diffMap[props.log.pathPair.unmatchedType].desc}
      </span>
    );
  }
};

const ReplayAnalysisPage: PageFC<PlanItemStatistics> = (props) => {
  const [selectedDiff, setSelectedDiff] = useState<Difference>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryStatistic>();
  const [diffs, setDiffs] = useState<QueryMsgWithDiffRes[]>([]);
  const [diffJsonViewData, setDiffJsonViewData] = useState<DiffJsonViewProps['data']>();
  const [diffJsonViewVisible, setDiffJsonViewVisible] = useState(false);

  const handleScenes = (diff: Difference, category?: CategoryStatistic) => {
    if (selectedDiff?.differenceName !== diff.differenceName) {
      setSelectedDiff(diff);
      setSelectedCategory(category);
    } else {
      setSelectedDiff(undefined);
    }
  };

  const handleSelectCategory = () => {
    setSelectedDiff(undefined);
    setDiffs([]);
  };

  useAsyncEffect(async () => {
    if (selectedCategory && selectedDiff) {
      const scenes = await ReplayService.queryScenes({
        categoryName: selectedCategory.categoryName,
        differenceName: selectedDiff.differenceName,
        operationName: selectedCategory.operationName,
        planItemId: props.page.data.planItemId.toString(),
      });

      const promiseAll = scenes.map((scene) =>
        ReplayService.queryMsgWithDiff({
          compareResultId: scene.compareResultId,
          logIndexes: scene.logIndexes,
        }),
      );

      const diffs = await Promise.all(promiseAll);
      setDiffs(diffs);
    }
  }, [selectedCategory, selectedDiff, props.page.data.planItemId]);

  return (
    <Space direction='vertical' style={{ display: 'flex' }}>
      <PanesTitle title={<span>Main Service API: {props.page.data.operationName}</span>} />
      <CollapseTable
        active={!!selectedDiff}
        table={
          <Analysis
            planItemId={props.page.data.planItemId}
            onScenes={handleScenes}
            onSelectCategory={handleSelectCategory}
          />
        }
        panel={
          <Card bordered={false} title='' bodyStyle={{ padding: '8px 16px' }}>
            {diffs
              .filter((i) => i.diffResultCode !== 2)
              .map((diff, index) => (
                <Card key={index} style={{ cursor: 'pointer' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ marginRight: '8px' }}>
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

                  {diff.logs.map((log, index) => (
                    <div key={index}>
                      <Tag color={diffMap[log.pathPair.unmatchedType]?.color}>
                        {diffMap[log.pathPair.unmatchedType]?.text}
                      </Tag>
                      <DiffLog log={log} />
                    </div>
                  ))}
                </Card>
              ))}

            <DiffJsonView
              data={diffJsonViewData}
              open={diffJsonViewVisible}
              onClose={() => setDiffJsonViewVisible(false)}
            />
          </Card>
        }
      />
    </Space>
  );
};

export default ReplayAnalysisPage;
