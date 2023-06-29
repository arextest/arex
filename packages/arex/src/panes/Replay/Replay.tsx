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

  const handleSelectPlan: PlanReportProps['onSelectedPlanChange'] = (plan, pagination) => {
    setSelectedPlan(plan);

    navPane({
      id: props.data.id,
      type: PanesType.REPLAY,
      data: Object.assign(
        {},
        props.data,
        plan ? pagination : { current: pagination.current, key: '-1' },
      ),
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
            refreshDep={refreshDep}
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
