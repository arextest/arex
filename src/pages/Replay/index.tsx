import { Empty, Space } from 'antd';
import React, { FC, useState } from 'react';

import { AppTitle, Report, Results } from '../../components/replay';
import { FlexCenterWrapper } from '../../components/styledComponents';
import CollapseTable from '../../components/styledComponents/CollapseTable';
import { ApplicationDataType, PlanStatistics } from '../../services/Replay.type';

const Replay: FC<{ data?: ApplicationDataType }> = ({ data }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanStatistics>();
  const handleSelectPlan = (plan: PlanStatistics) => {
    plan.planId === selectedPlan?.planId ? setSelectedPlan(undefined) : setSelectedPlan(plan);
  };
  return data ? (
    <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
      <AppTitle data={{ id: data.appId, name: data.appName, count: data.recordedCaseCount }} />

      <CollapseTable
        active={!!selectedPlan}
        table={
          <Results
            // defaultSelectFirst
            appId={data.appId}
            onSelectedPlanChange={handleSelectPlan}
          />
        }
        panel={<Report selectedPlan={selectedPlan} />}
      />

      {/* TODO Configuration */}
    </Space>
  ) : (
    <FlexCenterWrapper>
      <Empty description={'Please select an application'} />
    </FlexCenterWrapper>
  );
};

export default Replay;
