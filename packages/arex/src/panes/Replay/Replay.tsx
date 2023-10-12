import { ArexPaneFC, CollapseTable, getLocalStorage, useTranslation } from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { Alert } from 'antd';
import { merge } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';

import { EMAIL_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ApplicationService } from '@/services';
import { PlanStatistics } from '@/services/ReportService';
import { decodePaneKey } from '@/store/useMenusPanes';

import AppOwnersConfig, { AppOwnerConfigRef } from './AppOwnersConfig';
import AppTitle from './AppTitle';
import PlanItem from './PlanItem';
import PlanReport, { PlanReportProps } from './PlanReport';

const ReplayPage: ArexPaneFC = (props) => {
  const navPane = useNavPane();
  const { t } = useTranslation('components');

  const [replayWrapperRef] = useAutoAnimate();

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

  const email = getLocalStorage<string>(EMAIL_KEY);
  const [isOwner, setIsOwner] = useState(true);
  const [hasOwner, setHasOwner] = useState(true);
  const appOwnerConfigRef = useRef<AppOwnerConfigRef>(null);

  const { data: appInfo, refresh: getAppInfo } = useRequest(ApplicationService.getAppInfo, {
    defaultParams: [appId],
    onSuccess(res) {
      const isOwner = !!res.owners?.includes?.(email as string);
      setIsOwner(isOwner);
      setHasOwner(!!res.owners?.length);
      !res.owners?.length && appOwnerConfigRef?.current?.open();
    },
  });

  return (
    <div ref={replayWrapperRef}>
      {!hasOwner && (
        <Alert
          banner
          closable
          type='warning'
          message={
            <span>
              {t('replay.noAppOwnerAlert')}
              <a onClick={appOwnerConfigRef?.current?.open}>{t('replay.addOwner').toLowerCase()}</a>
              .
            </span>
          }
          style={{ margin: '-8px -16px 8px -16px' }}
        />
      )}

      <AppTitle
        appId={appId}
        appName={appInfo?.appName}
        readOnly={!isOwner}
        onRefresh={handleRefreshDep}
      />

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
            readOnly={!isOwner}
            filter={(record) => !!record.totalCaseCount}
            onRefresh={handleRefreshDep}
          />
        }
      />

      <AppOwnersConfig ref={appOwnerConfigRef} appId={appId} onAddOwner={getAppInfo} />
    </div>
  );
};

export default ReplayPage;
