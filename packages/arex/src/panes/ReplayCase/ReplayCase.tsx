import { SettingOutlined } from '@ant-design/icons';
import {
  ArexPaneFC,
  CollapseTable,
  DiffPath,
  getLocalStorage,
  PanesTitle,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Modal } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import { EMAIL_KEY } from '@/constant';
import CompareConfig from '@/panes/AppSetting/CompareConfig';
import { ComparisonService, ConfigService, ReportService, ScheduleService } from '@/services';
import { infoItem, PlanItemStatistics, ReplayCaseType } from '@/services/ReportService';

import Case from './Case';
import SaveCase, { SaveCaseRef } from './SaveCase';

const ReplayCasePage: ArexPaneFC<PlanItemStatistics & { filter: number }> = (props) => {
  const { message, notification } = App.useApp();
  const email = getLocalStorage<string>(EMAIL_KEY);
  const { t } = useTranslation(['components']);

  const [compareConfigOpen, setCompareConfigOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<ReplayCaseType>();

  const saveCaseRef = useRef<SaveCaseRef>(null);

  const {
    data: fullLinkInfo,
    loading: loadingFullLinkInfo,
    run: getQueryFullLinkInfo,
  } = useRequest(ReportService.queryFullLinkInfo, {
    manual: true,
  });

  const fullLinkInfoMerged = useMemo<infoItem[]>(() => {
    const { entrance, infoItemList } = fullLinkInfo || {};
    return [entrance, ...(infoItemList || [])].filter((item) => item && item.id) as infoItem[];
  }, [fullLinkInfo]);

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
          message: t('message.success', { ns: 'common' }),
          description: res.desc,
        });
      } else {
        notification.error({
          message: t('message.error', { ns: 'common' }),
          description: res.desc,
        });
      }
    },
  });

  const { run: handleIgnoreKey } = useRequest(
    (path: string[], global?: boolean) =>
      ComparisonService.insertIgnoreNode({
        operationId: global ? undefined : props.data.operationId,
        appId: props.data.appId,
        exclusions: path,
      }),
    {
      manual: true,
      onSuccess(success) {
        success && message.success(t('message.success', { ns: 'common' }));
      },
    },
  );

  const handleSortKey = (path: string[]) => {
    console.log(path);
  };

  /**
   * 请求 InterfaceResponse
   */
  const {
    data: interfaceResponse,
    mutate: setInterfaceResponse,
    run: queryInterfaceResponse,
  } = useRequest(
    () =>
      ConfigService.queryInterfaceResponse({
        id: props.data.operationId,
      }),
    {
      onBefore() {
        setInterfaceResponse();
      },
    },
  );

  const interfaceResponseParsed = useMemo<{ [key: string]: any }>(() => {
    const res = interfaceResponse?.operationResponse;
    if (res) return JSON.parse(res) || {};
    else return {};
  }, [interfaceResponse]);

  function handleClickRerunCase(recordId: string) {
    queryPlanFailCase({
      planId: props.data.planId,
      planItemIdList: [props.data.planItemId],
      recordIdList: [recordId],
    });
  }

  function handleClickCompareConfigSetting() {
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
            appId={props.data.appId}
            operationId={props.data.operationId}
            extra={
              <TooltipButton
                icon={<SettingOutlined />}
                title={'compareConfig'}
                onClick={handleClickCompareConfigSetting}
              />
            }
            loading={loadingFullLinkInfo}
            data={fullLinkInfoMerged}
            onIgnoreKey={handleIgnoreKey}
            onGlobalIgnoreKey={(path) => {
              console.log(path, 'global');
              handleIgnoreKey(path, true);
            }}
            onSortKey={handleSortKey}
            requestDiffMsg={ReportService.queryDiffMsgById}
            requestQueryLogEntity={ReportService.queryLogEntity}
            requestIgnoreNode={(path: string[]) =>
              ComparisonService.insertIgnoreNode({
                operationId: props.data.operationId,
                appId: props.data.appId,
                exclusions: path,
              })
            }
          />
        }
      />
      <SaveCase planId={props.data.planId} operationId={props.data.operationId} ref={saveCaseRef} />

      <Modal
        destroyOnClose
        width='60%'
        footer={false}
        title={'CompareConfig'}
        open={compareConfigOpen}
        onCancel={() => {
          setCompareConfigOpen(false);
        }}
      >
        <CompareConfig readOnly appId={props.data.appId} operationId={props.data.operationId} />
      </Modal>
    </>
  );
};

export default ReplayCasePage;
