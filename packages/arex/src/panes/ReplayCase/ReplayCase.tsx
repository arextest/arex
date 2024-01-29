import { SettingOutlined } from '@ant-design/icons';
import {
  ArexPaneFC,
  clearLocalStorage,
  CollapseTable,
  Label,
  PaneDrawer,
  PanesTitle,
  setLocalStorage,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { App } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { NextInterfaceButton } from '@/components';
import { APP_ID_KEY, PanesType } from '@/constant';
import CompareConfig from '@/panes/AppSetting/CompareConfig';
import CaseDiff from '@/panes/ReplayCase/CaseDiff';
import { IgnoreType } from '@/panes/ReplayCase/CaseDiff/CaseDiffViewer';
import { ComparisonService, ReportService, ScheduleService } from '@/services';
import { DependencyParams, ExpirationType } from '@/services/ComparisonService';
import { InfoItem, PlanItemStatistic, ReplayCaseType } from '@/services/ReportService';
import { useMenusPanes } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import CaseList, { CaseProps } from './CaseList';
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

  const {
    data: fullLinkInfo,
    loading: loadingFullLinkInfo,
    run: getQueryFullLinkInfo,
  } = useRequest(ReportService.queryFullLinkInfo, {
    manual: true,
  });
  const fullLinkInfoMerged = useMemo<InfoItem[]>(() => {
    const { entrance, infoItemList } = fullLinkInfo || {};
    return ([{ ...entrance, isEntry: true }, ...(infoItemList || [])] as InfoItem[]).filter(
      (item) => item.id,
    );
  }, [fullLinkInfo]);

  const handleClickRecord = (record: ReplayCaseType) => {
    const selected = selectedRecord?.recordId === record.recordId ? undefined : record;
    setSelectedRecord(selected);
    if (selected) {
      getQueryFullLinkInfo({
        recordId: record.recordId,
        planItemId: planItemId,
      });
    }
  };

  const handleCaseTableChange: CaseProps['onChange'] = () => {
    setSelectedRecord(undefined);
  };

  function handleClickSaveCase(record: ReplayCaseType) {
    saveCaseRef.current?.openModal(record);
    //   setOpen(true)
  }

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

  const { run: insertIgnoreNode } = useRequest(
    (path: string[], type?: IgnoreType) => {
      const isGlobal = type === IgnoreType.Global;
      const isTemporary = type === IgnoreType.Temporary;

      const dependencyParams: DependencyParams =
        isGlobal || selectedDependency?.isEntry
          ? ({} as DependencyParams)
          : {
              operationType: selectedDependency?.categoryName || selectedDependency?.operationType,
              operationName: selectedDependency?.operationName,
            };
      const temporaryParams = isTemporary
        ? {
            expirationType: ExpirationType.temporary,
            expirationDate: dayjs().add(7, 'day').valueOf(),
          }
        : {};

      return ComparisonService.insertIgnoreNode({
        operationId: isGlobal ? undefined : planItemData!.operationId,
        appId: planItemData!.appId,
        exclusions: path,
        ...dependencyParams,
        ...temporaryParams,
      });
    },
    {
      manual: true,
      onSuccess(success) {
        if (success) message.success(t('message.createSuccess', { ns: 'common' }));
        else message.error(t('message.createFailed', { ns: 'common' }));
      },
    },
  );

  function handleClickCompareConfigSetting(data?: InfoItem) {
    setSelectedDependency(data);
    setCompareConfigOpen(true);
  }

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
              <CaseList
                appId={planItemData.appId}
                appName={planItemData.appName}
                planId={planItemData.planId}
                operationName={planItemData.operationName}
                planItemId={planItemId}
                filter={props.data?.filter}
                onClick={handleClickRecord}
                onChange={handleCaseTableChange}
                onClickSaveCase={handleClickSaveCase}
                onClickRetryCase={() =>
                  retryPlan({
                    planId: planItemData!.planId,
                    planItemId,
                  })
                }
              />
            }
            panel={
              <CaseDiff
                appId={planItemData.appId}
                operationId={planItemData.operationId}
                loading={loadingFullLinkInfo}
                data={fullLinkInfoMerged}
                extra={
                  <TooltipButton
                    icon={<SettingOutlined />}
                    title={t('appSetting.compareConfig')}
                    onClick={() => handleClickCompareConfigSetting()}
                  />
                }
                itemsExtraRender={(data) => (
                  <TooltipButton
                    icon={<SettingOutlined />}
                    title={t('appSetting.compareConfig')}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickCompareConfigSetting(data);
                    }}
                    style={{ marginRight: '6px' }}
                  />
                )}
                onChange={setSelectedDependency}
                onIgnoreKey={insertIgnoreNode}
                onSortKey={(path) => {
                  setTargetNodePath(path);
                  setCompareConfigOpen(true);
                }}
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
