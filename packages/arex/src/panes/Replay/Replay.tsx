import {
  ArexPaneFC,
  clearLocalStorage,
  CollapseTable,
  setLocalStorage,
  useTranslation,
} from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { Alert } from 'antd';
import { merge } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { APP_ID_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ApplicationService } from '@/services';
import { PlanStatistics } from '@/services/ReportService';
import { useMenusPanes } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import AppOwnersConfig, { AppOwnerConfigRef } from './AppOwnersConfig';
import AppTitle from './AppTitle';
import PlanItem from './PlanItem';
import PlanReport, { PlanReportProps } from './PlanReport';

const ReplayPage: ArexPaneFC = (props) => {
  const navPane = useNavPane();
  const { activePane } = useMenusPanes();
  const { t } = useTranslation('components');

  const [replayWrapperRef] = useAutoAnimate();

  const [selectedPlan, setSelectedPlan] = useState<PlanStatistics>();
  const { id: appId } = useMemo(() => decodePaneKey(props.paneKey), [props.paneKey]);

  useEffect(() => {
    activePane?.key === props.paneKey && setLocalStorage(APP_ID_KEY, appId);
    return () => clearLocalStorage(APP_ID_KEY);
  }, [activePane?.id]);

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

  const [hasOwner, setHasOwner] = useState<boolean>(false);
  const appOwnerConfigRef = useRef<AppOwnerConfigRef>(null);

  const { data: appInfo, refresh: getAppInfo } = useRequest(ApplicationService.getAppInfo, {
    defaultParams: [appId],
    onSuccess(res) {
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
        readOnly={!hasOwner}
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
            readOnly={!hasOwner}
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
