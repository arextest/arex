import { useRequest } from 'ahooks';
import { App } from 'antd';
import {
  ArexPaneFC,
  CollapseTable,
  DiffPath,
  getLocalStorage,
  PanesTitle,
  useTranslation,
} from 'arex-core';
import React, { useMemo, useRef, useState } from 'react';

import { EMAIL_KEY } from '@/constant';
import { ComparisonService, ReportService, ScheduleService } from '@/services';
import { infoItem, PlanItemStatistics, ReplayCaseType } from '@/services/ReportService';

import Case from './Case';
import SaveCase, { SaveCaseRef } from './SaveCase';
// import { SaveCaseRef } from './SaveCase';

const ReplayCasePage: ArexPaneFC<PlanItemStatistics & { filter: number }> = (props) => {
  const { data } = props;
  const { message, notification } = App.useApp();
  const email = getLocalStorage<string>(EMAIL_KEY);

  const { t } = useTranslation(['components']);
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
        caseSourceFrom: data.caseStartTime,
        caseSourceTo: data.caseEndTime,
        appId: data.appId,
        operationCaseInfoList,
        operator: email as string,
        replayPlanType: 3,
        sourceEnv: 'pro',
        targetEnv: data.targetEnv,
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

  function handleClickRerunCase(recordId: string) {
    console.log(data);
    queryPlanFailCase({
      planId: data.planId,
      planItemIdList: [data.planItemId],
      recordIdList: [recordId],
    });
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
            loading={loadingFullLinkInfo}
            data={fullLinkInfoMerged}
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
      <SaveCase operationId={props.data.operationId} ref={saveCaseRef} />
    </>
  );
};

export default ReplayCasePage;
