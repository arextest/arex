import { Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { AppTitle, ReplayReport, ReplayTable } from '../components/replay';
import { FlexCenterWrapper } from '../components/styledComponents';
import CollapseTable from '../components/styledComponents/CollapseTable';
import { uuid } from '../helpers/utils';
import { ApplicationDataType, PlanStatistics } from '../services/Replay.type';
import { PageFC } from './index';

const ReplayPage: PageFC<ApplicationDataType> = (props) => {
  const { t } = useTranslation(['components']);
  const nav = useNavigate();
  const loc = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<PlanStatistics>();
  const handleSelectPlan = (plan: PlanStatistics) => {
    plan.planId === selectedPlan?.planId ? setSelectedPlan(undefined) : setSelectedPlan(plan);
  };

  const [refreshDep, setRefreshDep] = useState<string>();
  const handleRefreshDep = () => {
    setRefreshDep(uuid()); // 触发 ReplayTable 组件请求更新
  };

  useEffect(() => {
    if (selectedPlan?.planId) {
      nav(`${loc.pathname}?planId=${selectedPlan?.planId}`);
    }
  }, [selectedPlan]);

  return props.page.data ? (
    <>
      <AppTitle data={props.page.data} onRefresh={handleRefreshDep} />
      {JSON.stringify(selectedPlan)}
      <CollapseTable
        active={!!selectedPlan}
        table={
          <ReplayTable
            // defaultSelectFirst
            appId={props.page.data.appId}
            refreshDep={refreshDep}
            onSelectedPlanChange={handleSelectPlan}
          />
        }
        panel={<ReplayReport selectedPlan={selectedPlan} />}
      />
    </>
  ) : (
    <FlexCenterWrapper>
      <Empty description={t('replay.selectApplication')} />
    </FlexCenterWrapper>
  );
};

export default ReplayPage;
