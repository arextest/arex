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
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App } from 'antd';
import React, { useRef, useState } from 'react';
import { useImmer } from 'use-immer';

import { EMAIL_KEY } from '@/constant';
import CompareConfig from '@/panes/AppSetting/CompareConfig';
import { ComparisonService, ReportService, ScheduleService } from '@/services';
import { InfoItem, PlanItemStatistics, ReplayCaseType } from '@/services/ReportService';
import { MessageMap } from '@/services/ScheduleService';

import Case from './Case';
import SaveCase, { SaveCaseRef } from './SaveCase';

/**
 *  过滤 path[] 中的的数组 index 类型元素
 * @param path
 * @param jsonString
 */
function validateJsonPath(path: string[], jsonString: string) {
  try {
    const json = JSON.parse(jsonString);
    const { pathList } = path.reduce<{ json: any; pathList: string[] }>(
      (jsonPathData, path) => {
        if (Array.isArray(jsonPathData.json) && Number.isInteger(Number(path))) {
          jsonPathData.json = jsonPathData.json[Number(path)];
        } else {
          jsonPathData.json = jsonPathData.json[path];
          jsonPathData.pathList.push(path);
        }
        return jsonPathData;
      },
      { json, pathList: [] },
    );
    return pathList;
  } catch (error) {
    return false;
  }
}

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

  const { run: handleIgnoreKey } = useRequest(
    (path: string[], global?: boolean) =>
      ComparisonService.insertIgnoreNode({
        operationId: global ? undefined : props.data.operationId,
        appId: props.data.appId,
        dependencyId: selectedDependency?.idEntry ? undefined : selectedDependency?.dependencyId, // TODO 后端保证此处的 dependencyId 有效
        exclusions: path,
      }),
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
            onIgnoreKey={(path, jsonString) => {
              const validatedPath = validateJsonPath(path, jsonString);
              validatedPath && handleIgnoreKey(validatedPath);
            }}
            onGlobalIgnoreKey={(path, jsonString) => {
              const validatedPath = validateJsonPath(path, jsonString);
              validatedPath && handleIgnoreKey(validatedPath, true);
            }}
            onSortKey={(path: string[], jsonString) => {
              const validatedPath = validateJsonPath(path, jsonString);
              if (validatedPath) {
                setTargetNodePath(validatedPath);
                setCompareConfigOpen(true);
              }
            }}
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
