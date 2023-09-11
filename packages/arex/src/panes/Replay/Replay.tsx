import { ArexPaneFC, CollapseTable } from '@arextest/arex-core';
import { merge } from 'lodash';
import React, { useMemo, useState } from 'react';

import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { PlanStatistics } from '@/services/ReportService';
import { decodePaneKey } from '@/store/useMenusPanes';

import AppTitle from './AppTitle';
import PlanItem from './PlanItem';
import PlanReport, { PlanReportProps } from './PlanReport';

const ReplayPage: ArexPaneFC = (props) => {
  const navPane = useNavPane();
  const [selectedPlan, setSelectedPlan] = useState<PlanStatistics>();
  const { id: appId } = useMemo(() => decodePaneKey(props.paneKey), [props.paneKey]);

  const handleSelectPlan: PlanReportProps['onSelectedPlanChange'] = (plan, current, row) => {
    plan.planId === selectedPlan?.planId ? setSelectedPlan(undefined) : setSelectedPlan(plan);
    navPane({
      id: appId,
      type: PanesType.REPLAY,
      data: merge({ ...props.data }, { current, row }), // 同步当前选中的页码好行数
    });
  };

  const [refreshDep, setRefreshDep] = useState<number>();
  const handleRefreshDep = () => {
    setRefreshDep(new Date().getTime()); // 触发 ReplayTable 组件请求更新
  };

  return (
    <>
      <AppTitle appId={appId} onRefresh={handleRefreshDep} />
      <CollapseTable
        active={!!selectedPlan}
        table={
          <PlanReport
            appId={appId}
            refreshDep={refreshDep}
            onSelectedPlanChange={handleSelectPlan}
          />
        }
        panel={
          <PlanItem
            appId={appId}
            selectedPlan={selectedPlan}
            filter={(record) => !!record.totalCaseCount}
            onRefresh={handleRefreshDep}
          />
        }
      />
    </>
  );
};

export default ReplayPage;
