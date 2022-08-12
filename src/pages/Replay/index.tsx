import { Empty, Space } from 'antd';
import React, { FC, useState } from 'react';

import { AppTitle, Report, Results } from '../../components/replay';
import { FlexCenterWrapper } from '../../components/styledComponents';
import CollapseTable from '../../components/styledComponents/CollapseTable';
import { ApplicationDataType, PlanStatistics } from '../../services/Replay.type';
import { uuid } from '../../utils';

const Replay: FC<{ data?: ApplicationDataType }> = ({ data }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanStatistics>();
  const handleSelectPlan = (plan: PlanStatistics) => {
    plan.planId === selectedPlan?.planId ? setSelectedPlan(undefined) : setSelectedPlan(plan);
  };

  const [refreshDep, setRefreshDep] = useState<string>();
  const handleAfterCreatePlan = () => {
    setRefreshDep(uuid()); // 触发 Results 组件请求更新
  };

  return data ? (
    <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
      <AppTitle
        data={{ id: data.appId, name: data.appName, count: data.recordedCaseCount }}
        onCreatePlan={handleAfterCreatePlan}
      />

      <CollapseTable
        active={!!selectedPlan}
        table={
          <Results
            // defaultSelectFirst
            appId={data.appId}
            refreshDep={refreshDep}
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
