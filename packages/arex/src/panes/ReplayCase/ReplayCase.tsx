import { SettingOutlined } from '@ant-design/icons';
import { DiffPath } from '@arextest/arex-common';
import {
  ArexPaneFC,
  CollapseTable,
  getLocalStorage,
  i18n,
  I18nextLng,
  PaneDrawer,
  PanesTitle,
  PathHandler,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useImmer } from 'use-immer';

import { EMAIL_KEY } from '@/constant';
import CompareConfig from '@/panes/AppSetting/CompareConfig';
import { ComparisonService, ReportService, ScheduleService } from '@/services';
import { InfoItem, PlanItemStatistics, ReplayCaseType } from '@/services/ReportService';
import { MessageMap } from '@/services/ScheduleService';

import Case from './Case';
import SaveCase, { SaveCaseRef } from './SaveCase';

const ReplayCasePage: ArexPaneFC<PlanItemStatistics & { filter: number }> = (props) => {
  const { message, notification } = App.useApp();
  const email = getLocalStorage<string>(EMAIL_KEY);
  const { t } = useTranslation(['components']);

  const [compareConfigOpen, setCompareConfigOpen] = useState<boolean>(false);

  const [targetNodePath, setTargetNodePath] = useState<string[]>();
  const [selectedRecord, setSelectedRecord] = useState<ReplayCaseType>();

  // false 不存在 DependencyId，不显示 Dependency 配置
  // undefined 未指定 DependencyId，显示所有 Dependency 配置
  // string 指定 DependencyId，显示指定 Dependency 配置
  const [selectedDependency, setSelectedDependency] = useState<InfoItem>();

  const saveCaseRef = useRef<SaveCaseRef>(null);

  const { loading: loadingFullLinkInfo, run: getQueryFullLinkInfo } = useRequest(
    ReportService.queryFullLinkInfo,
    {
      manual: true,
      onSuccess(data) {
        const { entrance, infoItemList } = data || {};
        setFullLinkInfoMerged(
          ([{ ...entrance, idEntry: true }, ...(infoItemList || [])] as InfoItem[]).filter(
            (item) => item.id,
          ),
        );
      },
    },
  );
  const [fullLinkInfoMerged, setFullLinkInfoMerged] = useImmer<InfoItem[]>([]);

  const handleClickRecord = (record: ReplayCaseType) => {
    setSelectedRecord(selectedRecord?.recordId === record.recordId ? undefined : record);
    getQueryFullLinkInfo({
      recordId: record.recordId,
      planItemId: props.data.planItemId,
    });
  };

  function handleClickSaveCase(record: ReplayCaseType) {
    saveCaseRef.current?.openModal(record);
  }

  const { run: queryPlanFailCase } = useRequest(ReportService.queryPlanFailCase, {
    manual: true,
    onSuccess(operationCaseInfoList) {
      rerun({
        caseSourceFrom: props.data.caseStartTime,
        caseSourceTo: props.data.caseEndTime,
        appId: props.data.appId,
        operationCaseInfoList,
        operator: email as string,
        replayPlanType: 3,
        sourceEnv: 'pro',
        targetEnv: props.data.targetEnv,
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

  const { run: handleIgnoreKey } = useRequest(
    (path: string[], global?: boolean) =>
      ComparisonService.insertIgnoreNode({
        operationId: global ? undefined : props.data.operationId,
        appId: props.data.appId,
        dependencyId: selectedDependency?.idEntry ? undefined : selectedDependency?.dependencyId,
        exclusions: path,
      }),
    {
      manual: true,
      onSuccess(success) {
        success && message.success(t('message.success', { ns: 'common' }));
      },
    },
  );

  // 当 dependencyId 不存在时，手动添加接口依赖
  const { run: addDependencyToSystem } = useRequest(ReportService.addDependencyToSystem, {
    manual: true,
    onSuccess(res, [{ operationId }]) {
      setFullLinkInfoMerged((fullLinkInfoMerged) => {
        const index = fullLinkInfoMerged.findIndex((item) => item.operationId === operationId);
        console.log({ index });
        if (index > 0) fullLinkInfoMerged[index].dependencyId = res.dependencyId;
      });

      setSelectedDependency({
        ...(selectedDependency as InfoItem),
        dependencyId: res.dependencyId,
      });
    },
  });
  useEffect(() => {
    console.log(selectedDependency);
    if (selectedDependency && !selectedDependency.idEntry && !selectedDependency.dependencyId) {
      addDependencyToSystem({
        appId: props.data.appId,
        operationId: props.data.operationId,
        operationType: selectedDependency.categoryName,
        operationName: selectedDependency.operationName,
        msg: '',
      });
    }
  }, [selectedDependency]);

  const handleSortKey: PathHandler = (path: string[], targetEditor: 'left' | 'right') => {
    setTargetNodePath(path.filter((path) => Number.isNaN(Number(path))));
    setCompareConfigOpen(true);
  };

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

  return (
    <>
      <PanesTitle
        title={
          <span>
            {t('replay.caseServiceAPI')}: {props.data.operationName}
          </span>
        }
      />

      <CollapseTable
        active={!!selectedRecord}
        table={
          <Case
            planItemId={props.data.planItemId}
            filter={props.data.filter}
            onClick={handleClickRecord}
            onClickSaveCase={handleClickSaveCase}
            onClickRerunCase={handleClickRerunCase}
          />
        }
        panel={
          <DiffPath
            // contextMenuDisabled
            appId={props.data.appId}
            operationId={props.data.operationId}
            extra={
              <TooltipButton
                icon={<SettingOutlined />}
                title={'compareConfig'}
                onClick={() => handleClickCompareConfigSetting()}
              />
            }
            itemsExtraRender={(data) => (
              <TooltipButton
                icon={<SettingOutlined />}
                title={'compareConfig'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickCompareConfigSetting(data);
                }}
                style={{ marginRight: '6px' }}
              />
            )}
            loading={loadingFullLinkInfo}
            data={fullLinkInfoMerged}
            onChange={(id, record) => {
              setSelectedDependency(record);
            }}
            onIgnoreKey={(path) => handleIgnoreKey(path)}
            onGlobalIgnoreKey={(path) => handleIgnoreKey(path, true)}
            onSortKey={handleSortKey}
            requestDiffMsg={ScheduleService.queryDiffMsgById}
            requestQueryLogEntity={ScheduleService.queryLogEntity}
          />
        }
      />
      <SaveCase planId={props.data.planId} operationId={props.data.operationId} ref={saveCaseRef} />

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
          dependencyId={selectedDependency ? selectedDependency.dependencyId || false : undefined}
          sortArrayPath={targetNodePath}
          onSortDrawerClose={() => setTargetNodePath(undefined)}
        />
      </PaneDrawer>
    </>
  );
};

export default ReplayCasePage;
