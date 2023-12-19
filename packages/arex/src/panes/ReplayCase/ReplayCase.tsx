import {
  ArexPaneFC,
  clearLocalStorage,
  CollapseTable,
  jsonIndexPathFilter,
  Label,
  PaneDrawer,
  PanesTitle,
  PathHandler,
  setLocalStorage,
  useTranslation,
} from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { App, Badge, Tabs } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { NextInterfaceButton } from '@/components';
import { APP_ID_KEY, PanesType } from '@/constant';
import CompareConfig from '@/panes/AppSetting/CompareConfig';
import DiffCompare from '@/panes/ReplayCase/DiffCompare';
import ExpectationResult from '@/panes/ReplayCase/ExpectationResult';
import { ConfigService, ReportService, ScheduleService } from '@/services';
import { InfoItem, PlanItemStatistic, ReplayCaseType } from '@/services/ReportService';
import { useMenusPanes } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import Case, { CaseProps } from './Case';
import SaveCase, { SaveCaseRef } from './SaveCase';

const ReplayCasePage: ArexPaneFC<{ filter?: number } | undefined> = (props) => {
  const { message } = App.useApp();
  const { activePane } = useMenusPanes();
  const { t } = useTranslation(['components']);

  const [wrapperRef] = useAutoAnimate();

  const [planItemData, setPlanItemData] = useState<PlanItemStatistic>();
  const { id: planItemId } = useMemo(() => decodePaneKey(props.paneKey), [props.paneKey]);

  const [compareConfigOpen, setCompareConfigOpen] = useState<boolean>(false);

  const [targetNodePath, setTargetNodePath] = useState<string[]>();
  const [selectedRecord, setSelectedRecord] = useState<ReplayCaseType>();

  // false 不存在 DependencyId，不显示 Dependency 配置
  // undefined 未指定 DependencyId，显示所有 Dependency 配置
  // string 指定 DependencyId，显示指定 Dependency 配置
  const [selectedDependency, setSelectedDependency] = useState<InfoItem>();

  const saveCaseRef = useRef<SaveCaseRef>(null);

  useEffect(() => {
    activePane?.key === props.paneKey && setLocalStorage(APP_ID_KEY, planItemData?.appId);
    return () => clearLocalStorage(APP_ID_KEY);
  }, [planItemData, activePane?.id]);

  // fetch initial data
  useRequest(ReportService.queryPlanItemStatistic, {
    ready: !planItemData?.planItemId,
    defaultParams: [planItemId],
    onSuccess: setPlanItemData,
  });

  const { data: diffCompareData, loading: diffCompareLoading } = useRequest(
    () =>
      ReportService.queryFullLinkInfo({
        recordId: selectedRecord!.recordId,
        planItemId,
      }),
    {
      ready: !!selectedRecord?.recordId && !!planItemId,
      refreshDeps: [selectedRecord?.recordId, planItemId],
    },
  );

  const diffCompareDataSource = useMemo<InfoItem[]>(() => {
    const { entrance, infoItemList } = diffCompareData || {};
    return ([{ ...entrance, isEntry: true }, ...(infoItemList || [])] as InfoItem[]).filter(
      (item) => item.id,
    );
  }, [diffCompareData]);

  const { data: expectationResultDataSource = [], run: queryExpectationResult } = useRequest(
    () => ConfigService.queryExpectationResult(selectedRecord!.caseId),
    // () => ConfigService.queryExpectationResult('65801415bb7cd51da453c9ba'),
    {
      ready: !!selectedRecord?.caseId,
    },
  );

  const handleClickRecord = (record: ReplayCaseType) => {
    const selected = selectedRecord?.recordId === record.recordId ? undefined : record;
    setSelectedRecord(selected);
  };

  const handleCaseTableChange: CaseProps['onChange'] = () => {
    setSelectedRecord(undefined);
  };

  const { run: retryPlan } = useRequest(ScheduleService.reRunPlan, {
    manual: true,
    onSuccess(res) {
      if (res.result === 1) {
        message.success(t('message.success', { ns: 'common' }));
      } else {
        message.error(res.desc);
      }
    },
  });

  function handleClickCompareConfig(data?: InfoItem) {
    setSelectedDependency(data);
    setCompareConfigOpen(true);
  }

  const handleSortKey = useCallback<PathHandler>(({ path, type, targetEditor, jsonString }) => {
    const filteredPath = jsonIndexPathFilter(path, jsonString![targetEditor]);
    filteredPath && setTargetNodePath(filteredPath);
    setCompareConfigOpen(true);
  }, []);

  return (
    <div ref={wrapperRef}>
      <NextInterfaceButton
        type={PanesType.REPLAY_CASE}
        planItemId={planItemId}
        onGetPlanItemData={setPlanItemData}
      />

      {planItemData && (
        <>
          <PanesTitle
            title={
              <span key={'caseServiceAPI'}>
                <Label style={{ font: 'inherit' }}>{t('replay.caseServiceAPI')}</Label>
                {decodeURIComponent(planItemData.operationName || 'unknown')}
              </span>
            }
          />

          <CollapseTable
            active={!!selectedRecord}
            table={
              <Case
                appId={planItemData.appId}
                appName={planItemData.appName}
                planId={planItemData.planId}
                operationName={planItemData.operationName}
                planItemId={planItemId}
                filter={props.data?.filter}
                onClick={handleClickRecord}
                onChange={handleCaseTableChange}
                onClickSaveCase={saveCaseRef.current?.openModal}
                onClickRetryCase={() =>
                  retryPlan({
                    planId: planItemData!.planId,
                    planItemId,
                  })
                }
              />
            }
            panel={
              <Tabs
                size='small'
                items={[
                  {
                    key: 'diffCompare',
                    label: (
                      <Badge size='small' offset={[4, 2]} count={diffCompareDataSource.length}>
                        {t('replay.diffCompare')}
                      </Badge>
                    ),
                    children: (
                      <DiffCompare
                        appId={planItemData.appId}
                        operationId={planItemData.operationId}
                        loading={diffCompareLoading}
                        dataSource={diffCompareDataSource}
                        onSortKey={handleSortKey}
                        onDependencyChange={setSelectedDependency}
                        onClickCompareConfig={handleClickCompareConfig}
                      />
                    ),
                  },
                  {
                    key: 'expectationResult',
                    label: (
                      <Badge
                        size='small'
                        offset={[4, 2]}
                        count={expectationResultDataSource.length}
                      >
                        {t('replay.expectationResult')}
                      </Badge>
                    ),
                    children: <ExpectationResult dataSource={expectationResultDataSource} />,
                  },
                ]}
                tabBarStyle={{ paddingLeft: '16px' }}
              />
            }
          />

          <SaveCase
            planId={planItemData.planId}
            operationId={planItemData.operationId}
            ref={saveCaseRef}
            appId={planItemData.appId}
            operationName={planItemData.operationName || ''}
          />

          {/* CompareConfigModal */}
          <PaneDrawer
            destroyOnClose
            width='70%'
            footer={false}
            title={`${t('appSetting.compareConfig')} - ${planItemData.operationName}`}
            open={compareConfigOpen}
            onClose={() => {
              setCompareConfigOpen(false);
              setTargetNodePath(undefined);
            }}
          >
            <CompareConfig
              appId={planItemData.appId}
              operationId={planItemData.operationId || false}
              dependency={
                selectedDependency
                  ? selectedDependency.isEntry
                    ? false
                    : {
                        operationName: selectedDependency.operationName,
                        operationType:
                          selectedDependency.categoryName || selectedDependency.operationType,
                      }
                  : undefined
              }
              sortArrayPath={targetNodePath}
              onSortDrawerClose={() => setTargetNodePath(undefined)}
            />
          </PaneDrawer>
        </>
      )}
    </div>
  );
};

export default ReplayCasePage;
