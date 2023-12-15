import { SettingOutlined } from '@ant-design/icons';
import { DiffPath } from '@arextest/arex-common';
import {
  ArexPaneFC,
  clearLocalStorage,
  CollapseTable,
  DiffMatch,
  getJsonValueByPath,
  jsonIndexPathFilter,
  Label,
  PaneDrawer,
  PanesTitle,
  PathHandler,
  setLocalStorage,
  TargetEditor,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { App, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { NextInterfaceButton } from '@/components';
import { APP_ID_KEY, PanesType } from '@/constant';
import CompareConfig from '@/panes/AppSetting/CompareConfig';
import { ComparisonService, ReportService, ScheduleService } from '@/services';
import { DependencyParams, ExpirationType } from '@/services/ComparisonService';
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
    (path: string[], type?: string) => {
      const isGlobal = type === 'global';
      const isTemporary = type === 'temporary';

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
        success && message.success(t('message.success', { ns: 'common' }));
      },
    },
  );

  function handleClickCompareConfigSetting(data?: InfoItem) {
    setSelectedDependency(data);
    setCompareConfigOpen(true);
  }

  const handleIgnoreKey = useCallback<PathHandler>(
    ({ path, type, targetEditor, jsonString }) => {
      const filteredPath = jsonIndexPathFilter(path, jsonString![targetEditor]);
      filteredPath && insertIgnoreNode(filteredPath, type);
    },
    [insertIgnoreNode],
  );

  const handleSortKey = useCallback<PathHandler>(({ path, type, targetEditor, jsonString }) => {
    const filteredPath = jsonIndexPathFilter(path, jsonString![targetEditor]);
    filteredPath && setTargetNodePath(filteredPath);
    setCompareConfigOpen(true);
  }, []);

  const [modal, contextHolder] = Modal.useModal();
  const handleDiffMatch = useCallback<PathHandler>(
    ({ path, targetEditor, jsonString }) => {
      const another = targetEditor === TargetEditor.left ? TargetEditor.right : TargetEditor.left;
      const text1 = getJsonValueByPath(jsonString[targetEditor], path);
      const text2 = getJsonValueByPath(jsonString[another], path);

      modal.info({
        title: t('replay.diffMatch'),
        width: 800,
        maskClosable: true,
        content: <DiffMatch text1={text1} text2={text2} />,
        footer: false,
      });
    },
    [t],
  );

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
              <DiffPath
                operationId={planItemData.operationId}
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
                loading={loadingFullLinkInfo}
                data={fullLinkInfoMerged}
                onChange={setSelectedDependency}
                onIgnoreKey={handleIgnoreKey}
                onSortKey={handleSortKey}
                onDiffMatch={handleDiffMatch}
                requestDiffMsg={ScheduleService.queryDiffMsgById}
                requestQueryLogEntity={ScheduleService.queryLogEntity}
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

          {/* JsonDiffMathModal */}
          {contextHolder}

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
