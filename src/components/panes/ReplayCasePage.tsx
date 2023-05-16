import { useRequest } from 'ahooks';
import { App } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EmailKey } from '../../constant';
import { getLocalStorage, tryParseJsonString } from '../../helpers/utils';
import { useCustomSearchParams } from '../../router/useCustomSearchParams';
import ReplayService from '../../services/Replay.service';
import {
  infoItem,
  PlanItemStatistics,
  ReplayCase as ReplayCaseType,
} from '../../services/Replay.type';
import DiffPath from '../DiffPath';
import { Case, SaveCase, SaveCaseRef } from '../replay/Case';
import { CollapseTable, PanesTitle } from '../styledComponents';
import { PageFC } from './index';

const ReplayCasePage: PageFC<PlanItemStatistics> = (props) => {
  const { message, notification } = App.useApp();
  const { t } = useTranslation(['components']);
  const email = getLocalStorage<string>(EmailKey);

  const [selectedRecord, setSelectedRecord] = useState<ReplayCaseType>();

  const saveCaseRef = useRef<SaveCaseRef>(null);

  const params = useCustomSearchParams();
  const { data = JSON.parse(decodeURIComponent(params.query.data)) } = props.page;

  const {
    data: fullLinkInfo,
    loading: loadingFullLinkInfo,
    run: getQueryFullLinkInfo,
  } = useRequest(ReplayService.queryFullLinkInfo, {
    manual: true,
  });

  const fullLinkInfoMerged = useMemo<infoItem[]>(() => {
    const { entrance, infoItemList } = fullLinkInfo || {};
    return [entrance, ...(infoItemList || [])].filter(Boolean) as infoItem[];
  }, [fullLinkInfo]);

  const handleClickRecord = (record: ReplayCaseType) => {
    const selected = selectedRecord?.recordId === record.recordId ? undefined : record;
    setSelectedRecord(selected);
    selected &&
      getQueryFullLinkInfo({
        recordId: record.recordId,
        planItemId: props.page.data.planItemId,
      });
  };

  function handleClickSaveCase(record: ReplayCaseType) {
    saveCaseRef.current?.openModal(record);
  }

  const { run: queryPlanFailCase } = useRequest(ReplayService.queryPlanFailCase, {
    manual: true,
    onSuccess(operationCaseInfoList) {
      rerun({
        caseSourceFrom: data.caseStartTime,
        caseSourceTo: data.caseEndTime,
        appId: data.appId,
        operationCaseInfoList,
        operator: email,
        replayPlanType: 2,
        sourceEnv: 'pro',
        targetEnv: data.targetHost,
      });
    },
  });

  const { run: rerun } = useRequest(ReplayService.createPlan, {
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
            {t('replay.caseServiceAPI')}: {data.operationName}
          </span>
        }
      />

      <CollapseTable
        active={!!selectedRecord}
        table={
          <Case
            planItemId={data.planItemId}
            status={params.query.status}
            onClick={handleClickRecord}
            onClickSaveCase={handleClickSaveCase}
            onClickRerunCase={handleClickRerunCase}
          />
        }
        panel={
          <DiffPath
            appId={data.appId}
            operationId={data.operationId}
            loading={loadingFullLinkInfo}
            data={fullLinkInfoMerged}
          />
        }
      />
      <SaveCase operationId={data.operationId} ref={saveCaseRef} />
    </>
  );
};

export default ReplayCasePage;
