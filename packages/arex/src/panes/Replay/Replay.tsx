import { Empty } from 'antd';
import { ArexPaneFC, CollapseTable, FlexCenterWrapper, useTranslation } from 'arex-core';
import React, { useState } from 'react';

import { ApplicationDataType } from '@/services/ApplicationService';
import { PlanStatistics } from '@/services/ReportService';

import AppTitle from './AppTitle';
import PlanItem from './PlanItem';
import PlanReport from './PlanReport';

const ReplayPage: ArexPaneFC<ApplicationDataType> = (props) => {
  const { t } = useTranslation(['components']);
  const [selectedPlan, setSelectedPlan] = useState<PlanStatistics>();

  const handleSelectPlan = (plan: PlanStatistics) => {
    plan.planId === selectedPlan?.planId ? setSelectedPlan(undefined) : setSelectedPlan(plan);
  };

  const [refreshDep, setRefreshDep] = useState<number>();
  const handleRefreshDep = () => {
    setRefreshDep(new Date().getTime()); // 触发 ReplayTable 组件请求更新
  };

  return props.data ? (
    <>
      <AppTitle data={props.data} onRefresh={handleRefreshDep} />
      <CollapseTable
        active={!!selectedPlan}
        table={
          <PlanReport
            defaultSelectFirst
            appId={props.data.appId}
            refreshDep={refreshDep}
            onSelectedPlanChange={handleSelectPlan}
          />
        }
        panel={
          <PlanItem selectedPlan={selectedPlan} filter={(record) => !!record.totalCaseCount} />
        }
      />
    </>
  ) : (
    <FlexCenterWrapper>
      <Empty description={t('replay.selectApplication')} />
    </FlexCenterWrapper>
  );
};

export default ReplayPage;
