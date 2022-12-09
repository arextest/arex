import './ReplayAnalysis.css';

import { StopOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Collapse, Space, Spin, Tag, theme, Typography } from 'antd';
import React, { FC, useState } from 'react';

import { TooltipButton } from '../components';
import { Analysis } from '../components/replay';
import DiffJsonView, { DiffJsonViewProps } from '../components/replay/DiffJsonView';
import { CollapseTable, PanesTitle } from '../components/styledComponents';
import ReplayService from '../services/Replay.service';
import {
  CategoryStatistic,
  Difference,
  PlanItemStatistics,
  QueryMsgWithDiffRes,
  Scene,
} from '../services/Replay.type';
import { PageFC } from './index';

const DiffMap: {
  [unmatchedType: string]: {
    text: string;
    color: string;
    desc?: string;
  };
} = {
  '0': {
    text: 'Unknown',
    color: 'default',
  },
  '1': {
    text: 'Left Missing',
    color: 'orange',
    desc: 'is missing on the left',
  },
  '3': {
    text: 'Different Value',
    color: 'magenta',
  },
  '2': {
    text: 'Right Missing',
    color: 'blue',
    desc: 'is missing on the right',
  },
};

const DiffList: FC<{ scene?: Scene; onTreeModeClick?: (diff?: QueryMsgWithDiffRes) => void }> = (
  props,
) => {
  const { token } = theme.useToken();

  const { data: diffData, loading } = useRequest(
    () =>
      ReplayService.queryMsgWithDiff({
        compareResultId: props.scene!.compareResultId,
        logIndexes: props.scene!.logIndexes,
      }),
    {
      ready: !!props.scene,
      onSuccess(res) {
        console.log({ res });
      },
    },
  );

  return (
    <Card
      size='small'
      title={!loading && `${diffData?.logs.length} issue(s)`}
      extra={
        <Button
          size='small'
          disabled={loading}
          onClick={() => props.onTreeModeClick?.(diffData)}
          style={{ marginLeft: '8px' }}
        >
          Tree Mode
        </Button>
      }
      loading={loading}
      style={{ minHeight: '56px' }}
    >
      <Space direction='vertical' style={{ width: '100%' }}>
        {diffData?.logs.map((log, index) => (
          <div key={index} style={{ display: 'flex', flexFlow: 'row nowrap' }}>
            <Tag color={DiffMap[log.pathPair.unmatchedType]?.color}>
              {DiffMap[log.pathPair.unmatchedType]?.text}
            </Tag>

            {log.pathPair.unmatchedType === 3 ? (
              <Typography.Text>
                {'Value of '}
                <Typography.Text code>{log.path || '[]'}</Typography.Text>
                {' is different, excepted '}
                <Typography.Text code ellipsis style={{ maxWidth: '200px' }}>
                  {log.baseValue || '[]'}
                </Typography.Text>
                {', actual '}
                <Typography.Text code ellipsis style={{ maxWidth: '200px' }}>
                  {log.testValue || '[]'}
                </Typography.Text>
                {'.'}
              </Typography.Text>
            ) : (
              <span>
                <Typography.Text code>{log.path}</Typography.Text>
                {DiffMap[log.pathPair.unmatchedType].desc}
              </span>
            )}

            <TooltipButton
              size='small'
              type='default'
              breakpoint='xxl'
              title='Ignore Node'
              icon={<StopOutlined />}
              style={{ float: 'right', marginLeft: 'auto' }}
            />
          </div>
        ))}
      </Space>
    </Card>
  );
};

const ReplayAnalysisPage: PageFC<PlanItemStatistics> = (props) => {
  const { token } = theme.useToken();

  const [selectedDiff, setSelectedDiff] = useState<Difference>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryStatistic>();
  const [activeKey, setActiveKey] = useState<string[] | string>(['0']);

  const [diffJsonViewData, setDiffJsonViewData] = useState<DiffJsonViewProps['data']>();
  const [diffJsonViewVisible, setDiffJsonViewVisible] = useState(false);

  const handleScenes = (diff: Difference, category?: CategoryStatistic) => {
    if (selectedDiff?.differenceName !== diff.differenceName) {
      setSelectedDiff(diff);
      setSelectedCategory(category);
      setActiveKey(['0']);
    } else {
      setSelectedDiff(undefined);
    }
  };

  const handleSelectCategory = () => {
    setSelectedDiff(undefined);
  };

  const { data: scenes = [] } = useRequest(
    () =>
      ReplayService.queryScenes({
        categoryName: selectedCategory!.categoryName,
        differenceName: selectedDiff!.differenceName,
        operationName: selectedCategory!.operationName,
        planItemId: props.page.data.planItemId.toString(),
      }),
    {
      ready: !!selectedCategory && !!selectedDiff && !!props.page.data.planItemId,
      refreshDeps: [selectedCategory, selectedDiff, props.page.data.planItemId],
    },
  );

  return (
    <Space direction='vertical' style={{ display: 'flex' }} >
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
          <Collapse
            activeKey={activeKey}
            onChange={setActiveKey}
            style={{ width: '100%', padding: token.padding }}
          >
            {scenes.map((scene, index) => (
              <Collapse.Panel
                header={<Typography.Text>{scene.sceneName}</Typography.Text>}
                key={index}
              >
                <DiffList
                  scene={scene}
                  onTreeModeClick={(diff) => {
                    if (diff) {
                      setDiffJsonViewData({
                        baseMsg: diff.baseMsg,
                        testMsg: diff.testMsg,
                        logs: diff.logs,
                      });
                      setDiffJsonViewVisible(true);
                    }
                  }}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        }
      />

      <DiffJsonView
        data={diffJsonViewData}
        open={diffJsonViewVisible}
        onClose={() => setDiffJsonViewVisible(false)}
      />
    </Space>
  );
};

export default ReplayAnalysisPage;
