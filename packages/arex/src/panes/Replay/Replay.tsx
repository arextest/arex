import { ArexPaneFC, CollapseTable, FlexCenterWrapper, useTranslation } from '@arextest/arex-core';
import { Empty } from 'antd';
import { merge } from 'lodash';
import React, { useState } from 'react';

import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ApplicationDataType } from '@/services/ApplicationService';
import { PlanStatistics } from '@/services/ReportService';

import AppTitle from './AppTitle';
import PlanItem from './PlanItem';
import PlanReport, { PlanReportProps } from './PlanReport';

const ReplayPage: ArexPaneFC<ApplicationDataType> = (props) => {
  const { t } = useTranslation(['components']);
  const navPane = useNavPane();
  const [selectedPlan, setSelectedPlan] = useState<PlanStatistics>();

  const handleSelectPlan: PlanReportProps['onSelectedPlanChange'] = (
    plan,
    { current = 0, key },
  ) => {
    plan.planId === selectedPlan?.planId ? setSelectedPlan(undefined) : setSelectedPlan(plan);
    navPane({
      id: props.data.id,
      type: PanesType.REPLAY,
      data: merge({ current, key }, props.data), // 同步当前选中的页码好行数
    });
  };

  const [refreshDep, setRefreshDep] = useState<number>();
  const handleRefreshDep = () => {
    setRefreshDep(new Date().getTime()); // 触发 ReplayTable 组件请求更新
  };

  return props.data ? (
    <>
      <AppTitle data={props.data} onRefresh={handleRefreshDep} onCreateReplay={handleRefreshDep} />
      <CollapseTable
        active={!!selectedPlan}
        table={
          <PlanReport
            id={props.data.id}
            appId={props.data.appId}
            refreshDep={refreshDep}
            onSelectedPlanChange={handleSelectPlan}
          />
        }
        panel={
          <PlanItem
            id={props.data.id}
            selectedPlan={selectedPlan}
            filter={(record) => !!record.totalCaseCount}
            onRefresh={handleRefreshDep}
          />
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
