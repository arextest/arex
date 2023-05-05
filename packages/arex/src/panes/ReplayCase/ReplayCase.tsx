import { useRequest } from 'ahooks';
import { ArexPaneFC, CollapseTable, DiffPath, PanesTitle, useTranslation } from 'arex-core';
import React, { useMemo, useRef, useState } from 'react';

import { ComparisonService, ReportService } from '../../services';
import { infoItem, PlanItemStatistics, ReplayCaseType } from '../../services/ReportService';
import Case from './Case';
import SaveCase, { SaveCaseRef } from './SaveCase';
// import { SaveCaseRef } from './SaveCase';

const ReplayCasePage: ArexPaneFC<PlanItemStatistics & { filter: number }> = (props) => {
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
    return [entrance, ...(infoItemList || [])].filter(Boolean) as infoItem[];
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
            onClick={handleClickRecord}
            onClickSaveCase={handleClickSaveCase}
            filter={props.data.filter}
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
