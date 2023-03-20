import { useRequest } from 'ahooks';
import { Collapse, Typography } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ReplayService from '../../services/Replay.service';
import { CategoryStatistic, Difference, PlanItemStatistics } from '../../services/Replay.type';
import { DiffJsonViewProps, DiffList, DiffScenes } from '../replay/Analysis';
import DiffJsonViewDrawer from '../replay/Analysis/DiffJsonView/DiffJsonViewDrawer';
import { CollapseTable, PanesTitle } from '../styledComponents';
import { PageFC } from './index';

const ReplayAnalysisPage: PageFC<PlanItemStatistics> = (props) => {
  const { t } = useTranslation(['components']);

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
    <>
      <PanesTitle
        title={
          <span>
            {t('replay.caseServiceAPI')}: {props.page.data.operationName}
          </span>
        }
      />
      <CollapseTable
        active={!!selectedDiff}
        table={
          <DiffScenes
            planItemId={props.page.data.planItemId}
            onScenes={handleScenes}
            onSelectCategory={handleSelectCategory}
          />
        }
        panel={
          <Collapse activeKey={activeKey} onChange={setActiveKey} style={{ width: '100%' }}>
            {scenes.map((scene, index) => (
              <Collapse.Panel
                header={<Typography.Text>{`Scene ${index + 1}`}</Typography.Text>}
                key={index}
              >
                <DiffList
                  appId={props.page.data.appId}
                  operationId={props.page.data.operationId}
                  scene={scene}
                  onTreeModeClick={(diff: any) => {
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

      <DiffJsonViewDrawer
        data={diffJsonViewData}
        open={diffJsonViewVisible}
        onClose={() => setDiffJsonViewVisible(false)}
      />
    </>
  );
};

export default ReplayAnalysisPage;
