import {
  ArexPaneFC,
  CollapseTable,
  DiffJsonViewDrawer,
  DiffJsonViewProps,
  PanesTitle,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Collapse, Typography } from 'antd';
import React, { useState } from 'react';

import { ReportService } from '@/services';
import { CategoryStatistic, Difference, PlanItemStatistics } from '@/services/ReportService';

import DiffList from './DiffList';
import DiffScenes from './DiffScenes';

const ReplayAnalysis: ArexPaneFC<PlanItemStatistics> = (props) => {
  const { t } = useTranslation(['components']);

  const [selectedDiff, setSelectedDiff] = useState<Difference>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryStatistic>();
  const [activeKey, setActiveKey] = useState<string[] | string>(['0']);

  const [diffJsonViewData, setDiffJsonViewData] =
    useState<Pick<DiffJsonViewProps, 'diffJson' | 'diffPath'>>();
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
      ReportService.queryScenes({
        categoryName: selectedCategory!.categoryName,
        differenceName: selectedDiff!.differenceName,
        operationName: selectedCategory!.operationName,
        planItemId: props.data.planItemId.toString(),
      }),
    {
      ready: !!selectedCategory && !!selectedDiff && !!props.data.planItemId,
      refreshDeps: [selectedCategory, selectedDiff, props.data.planItemId],
    },
  );

  return (
    <>
      <PanesTitle
        title={
          <span>
            {t('replay.caseServiceAPI')}: {props.data.operationName}
          </span>
        }
      />
      <CollapseTable
        active={!!selectedDiff}
        table={
          <DiffScenes
            planItemId={props.data.planItemId}
            onScenes={handleScenes}
            onSelectCategory={handleSelectCategory}
          />
        }
        panel={
          <Collapse
            activeKey={activeKey}
            items={scenes.map((scene, index) => ({
              key: index,
              label: <Typography.Text>{`Scene ${index + 1}`}</Typography.Text>,
              children: (
                <DiffList
                  scene={scene}
                  appId={props.data.appId}
                  operationId={props.data.operationId}
                  onTreeModeClick={(diff) => {
                    if (diff) {
                      setDiffJsonViewData({
                        diffJson: {
                          left: String(diff.baseMsg) || '',
                          right: String(diff.testMsg) || '',
                        },
                        diffPath: diff.logs || [],
                      });
                      setDiffJsonViewVisible(true);
                    }
                  }}
                />
              ),
            }))}
            onChange={setActiveKey}
            style={{ width: '100%' }}
          />
        }
      />

      <DiffJsonViewDrawer
        {...diffJsonViewData}
        title={t('replay.treeMode')}
        open={diffJsonViewVisible}
        onClose={() => setDiffJsonViewVisible(false)}
      />
    </>
  );
};

export default ReplayAnalysis;
