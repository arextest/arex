import { useRequest } from 'ahooks';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { tryParseJsonString } from '../../helpers/utils';
import { useCustomSearchParams } from '../../router/useCustomSearchParams';
import ReplayService from '../../services/Replay.service';
import {
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
    data: diffMsgAll = {
      compareResultDetailList: [],
      totalCount: 0,
    },
    mutate: setDiffMsgAll,
    loading: loadingDiffMsgAll,
    run: queryAllDiffMsg,
  } = useRequest(
    (params: Pick<QueryAllDiffMsgReq, 'recordId' | 'planItemId'>) =>
      ReplayService.queryAllDiffMsg({
        ...params,
        diffResultCodeList: [0, 1, 2],
        pageIndex: 0,
        pageSize: 2000, // TODO lazy load
        needTotal: true,
      }),
    {
      manual: true,
      onBefore() {
        setDiffMsgAll();
      },
    },
  );

  const handleClickRecord = (record: ReplayCaseType) => {
    setSelectedRecord(selectedRecord?.recordId === record.recordId ? undefined : record);
    queryAllDiffMsg({
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
            loading={loadingDiffMsgAll}
            data={diffMsgAll.compareResultDetailList}
          />
        }
      />
      <SaveCase operationId={data.operationId} ref={saveCaseRef} />
    </>
  );
};

export default ReplayCasePage;
