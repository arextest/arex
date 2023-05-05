import { useRequest } from 'ahooks';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { tryParseJsonString } from '../../helpers/utils';
import { useCustomSearchParams } from '../../router/useCustomSearchParams';
import ReplayService from '../../services/Replay.service';
import {
  infoItem,
  PlanItemStatistics,
  QueryAllDiffMsgReq,
  ReplayCase as ReplayCaseType,
} from '../../services/Replay.type';
import DiffPath from '../DiffPath';
import { Case, SaveCase, SaveCaseRef } from '../replay/Case';
import { CollapseTable, PanesTitle } from '../styledComponents';
import { PageFC } from './index';

const ReplayCasePage: PageFC<PlanItemStatistics> = (props) => {
  const { t } = useTranslation(['components']);
  const [selectedRecord, setSelectedRecord] = useState<ReplayCaseType>();

  const saveCaseRef = useRef<SaveCaseRef>(null);

  const params = useCustomSearchParams();
  const { data = tryParseJsonString(decodeURIComponent(params.query.data)) } = props.page;

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
    setSelectedRecord(selectedRecord?.recordId === record.recordId ? undefined : record);
    getQueryFullLinkInfo({
      recordId: record.recordId,
      planItemId: props.page.data.planItemId,
    });
  };

  function handleClickSaveCase(record: ReplayCaseType) {
    saveCaseRef.current?.openModal(record);
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
            onClick={handleClickRecord}
            onClickSaveCase={handleClickSaveCase}
            status={params.query.status}
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
