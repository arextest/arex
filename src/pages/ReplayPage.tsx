import { Empty, Space } from 'antd';
import React, { FC, useState } from 'react';

import { AppTitle, Report, Results } from '../components/replay';
import { FlexCenterWrapper } from '../components/styledComponents';
import CollapseTable from '../components/styledComponents/CollapseTable';
import { uuid } from '../helpers/utils';
import { ApplicationDataType, PlanStatistics } from '../services/Replay.type';
import { PageFC } from './index';

const ReplayPage: PageFC<ApplicationDataType> = (props) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanStatistics>();
  const handleSelectPlan = (plan: PlanStatistics) => {
    plan.planId === selectedPlan?.planId ? setSelectedPlan(undefined) : setSelectedPlan(plan);
  };

  const [refreshDep, setRefreshDep] = useState<string>();
  const handleRefreshDep = () => {
    setRefreshDep(uuid()); // 触发 Results 组件请求更新
  };

  return props.page.data ? (
    <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
      <AppTitle data={props.page.data} onRefresh={handleRefreshDep} />

      <CollapseTable
        active={!!selectedPlan}
        table={
          <Results
            // defaultSelectFirst
            appId={props.page.data.appId}
            refreshDep={refreshDep}
            onSelectedPlanChange={handleSelectPlan}
          />
        }
        panel={<Report selectedPlan={selectedPlan} />}
      />
    </Space>
  ) : (
    <FlexCenterWrapper>
      <Empty description={'Please select an application'} />
    </FlexCenterWrapper>
  );
};

export default ReplayPage;
