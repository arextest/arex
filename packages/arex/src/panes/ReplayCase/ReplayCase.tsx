import { SettingOutlined } from '@ant-design/icons';
import { DiffPath } from '@arextest/arex-common';
import {
  ArexPaneFC,
  clearLocalStorage,
  CollapseTable,
  DiffMatch,
  getJsonValueByPath,
  getLocalStorage,
  i18n,
  I18nextLng,
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
import { useRequest } from 'ahooks';
import { App, Breadcrumb, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { APP_ID_KEY, EMAIL_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import CompareConfig from '@/panes/AppSetting/CompareConfig';
import { ComparisonService, ReportService, ScheduleService } from '@/services';
import { DependencyParams, ExpirationType } from '@/services/ComparisonService';
import { InfoItem, PlanItemStatistics, ReplayCaseType } from '@/services/ReportService';
import { MessageMap } from '@/services/ScheduleService';
import { useMenusPanes } from '@/store';

import Case, { CaseProps } from './Case';
import SaveCase, { SaveCaseRef } from './SaveCase';

const ReplayCasePage: ArexPaneFC<PlanItemStatistics & { filter: number }> = (props) => {
  const { message, notification } = App.useApp();
  const { activePane, removePane } = useMenusPanes();
  const email = getLocalStorage<string>(EMAIL_KEY);
  const { t } = useTranslation(['components']);
  const navPane = useNavPane();

  const [compareConfigOpen, setCompareConfigOpen] = useState<boolean>(false);

  const [targetNodePath, setTargetNodePath] = useState<string[]>();
  const [selectedRecord, setSelectedRecord] = useState<ReplayCaseType>();

  // false 不存在 DependencyId，不显示 Dependency 配置
  // undefined 未指定 DependencyId，显示所有 Dependency 配置
  // string 指定 DependencyId，显示指定 Dependency 配置
  const [selectedDependency, setSelectedDependency] = useState<InfoItem>();

  const saveCaseRef = useRef<SaveCaseRef>(null);

  useEffect(() => {
    activePane?.key === props.paneKey && setLocalStorage(APP_ID_KEY, props.data.appId);
    return () => clearLocalStorage(APP_ID_KEY);
  }, [activePane?.id]);

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
        planItemId: props.data.planItemId,
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

  const { run: queryPlanFailCase } = useRequest(ReportService.queryPlanFailCase, {
    manual: true,
    onSuccess(operationCaseInfoList) {
      rerun({
        caseSourceFrom: +props.data.caseStartTime,
        caseSourceTo: +props.data.caseEndTime,
        appId: props.data.appId,
        operationCaseInfoList,
        operator: email as string,
        replayPlanType: 3,
        sourceEnv: 'pro',
        targetEnv: decodeURIComponent(props.data.targetEnv || ''),
      });
    },
  });

  const { run: rerun } = useRequest(ScheduleService.createPlan, {
    manual: true,

    onSuccess(res) {
      if (res.result === 1) {
        notification.success({
          message: t('replay.startSuccess'),
        });
      } else {
        notification.error({
          message: t('message.error', { ns: 'common' }),
          description: MessageMap[i18n.language as I18nextLng][res.data.reasonCode],
        });
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
        operationId: isGlobal ? undefined : props.data.operationId,
        appId: props.data.appId,
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
  function handleClickRerunCase(recordId: string) {
    queryPlanFailCase({
      planId: props.data.planId,
      planItemIdList: [props.data.planItemId],
      recordIdList: [recordId],
    });
  }

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

  if (!props.data) {
    removePane(undefined);
    return null;
  }

  return (
    <>
      <Breadcrumb
        separator='>'
        items={[
          {
            key: props.data.appId,
            title: <a>{props.data.appId}</a>,
            onClick: () =>
              navPane({
                type: PanesType.REPLAY,
                id: props.data.appId,
              }),
          },
          {
            key: props.data.planItemId,
            title: props.data.operationName || 'unknown',
          },
        ]}
      />
      <PanesTitle
        title={
          <span>
            <Label style={{ font: 'inherit' }}>{t('replay.caseServiceAPI')}</Label>
            {decodeURIComponent(props.data.operationName || 'unknown')}
          </span>
        }
      />

      <CollapseTable
        active={!!selectedRecord}
        table={
          <Case
            planId={props.data.planId}
            operationName={props.data.operationName}
            planItemId={props.data.planItemId}
            filter={props.data.filter}
            onClick={handleClickRecord}
            onChange={handleCaseTableChange}
            onClickSaveCase={handleClickSaveCase}
            onClickRerunCase={handleClickRerunCase}
          />
        }
        panel={
          <DiffPath
            operationId={props.data.operationId}
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
        planId={props.data.planId}
        operationId={props.data.operationId}
        ref={saveCaseRef}
        appId={props.data.appId}
        operationName={props.data.operationName || ''}
      />

      {/* JsonDiffMathModal */}
      {contextHolder}

      {/* CompareConfigModal */}
      <PaneDrawer
        destroyOnClose
        width='70%'
        footer={false}
        title={`${t('appSetting.compareConfig')} - ${props.data.operationName}`}
        open={compareConfigOpen}
        onClose={() => {
          setCompareConfigOpen(false);
          setTargetNodePath(undefined);
        }}
      >
        <CompareConfig
          appId={props.data.appId}
          operationId={props.data.operationId || false}
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
  );
};

export default ReplayCasePage;
