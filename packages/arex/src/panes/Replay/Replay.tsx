import { ArexPaneFC, CollapseTable, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Alert } from 'antd';
import { merge } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';

import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ApplicationService } from '@/services';
import { PlanStatistics } from '@/services/ReportService';
import { decodePaneKey } from '@/store/useMenusPanes';

import AppOwnerConfig, { AppOwnerConfigRef } from './AppOwnerConfig';
import AppTitle from './AppTitle';
import PlanItem from './PlanItem';
import PlanReport, { PlanReportProps } from './PlanReport';

const ReplayPage: ArexPaneFC = (props) => {
  const navPane = useNavPane();
  const { t } = useTranslation('components');

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

  const [hasOwner, setHasOwner] = useState(true);
  const appOwnerConfigRef = useRef<AppOwnerConfigRef>(null);
  const { data: appInfo, refresh: getAppInfo } = useRequest(ApplicationService.getAppInfo, {
    defaultParams: [appId],
    onSuccess(res) {
      setHasOwner(!!res.owners?.length);
    },
  });

  return (
    <>
      {!hasOwner && (
        <Alert
          banner
          closable
          type='warning'
          message={
            <span>
              {t('replay.noAppOwnerAlert')}
              <a onClick={appOwnerConfigRef?.current?.open}>{t('replay.addOwner')}</a>.
            </span>
          }
          style={{ margin: '-8px -16px 8px -16px' }}
        />
      )}

      <AppTitle appId={appId} appName={appInfo?.appName} onRefresh={handleRefreshDep} />

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

      <AppOwnerConfig ref={appOwnerConfigRef} appId={appId} onClose={getAppInfo} />
    </>
  );
};

export default ReplayPage;
