import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { Divider, Space, Switch } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCustomSearchParams } from '../../router/useCustomSearchParams';
import ReplayService from '../../services/Replay.service';
import { PlanItemStatistics, ReplayCase as ReplayCaseType } from '../../services/Replay.type';
import DiffJsonViewTooltip from '../replay/Analysis/DiffJsonView/DiffJsonViewTooltip';
import { Case, SaveCase, SaveCaseRef } from '../replay/Case';
import {
  CollapseTable,
  EmptyWrapper,
  Label,
  PanesTitle,
  SpaceBetweenWrapper,
} from '../styledComponents';
import { PageFC } from './index';
import DiffScenes from './ReplayDiffScenesPage/DiffScenes';

const ReplayCasePage: PageFC<PlanItemStatistics> = (props) => {
  const { t } = useTranslation(['components']);
  const [onlyFailed, setOnlyFailed] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<ReplayCaseType>();

  const saveCaseRef = useRef<SaveCaseRef>(null);

  const params = useCustomSearchParams();
  const { data = params.query.data } = props.page;

  const {
    data: diffMsgAll = {
      compareResultDetailList: [],
      totalCount: 0,
    },
    mutate: setDiffMsgAll,
    loading: loadingDiffMsgAll,
    run: queryAllDiffMsg,
  } = useRequest(
    (params: { recordId: string; replayId: string }) =>
      ReplayService.queryAllDiffMsg({
        ...params,
        diffResultCodeList: [0, 1, 2],
        pageIndex: 0,
        pageSize: 99, // TODO lazy load
        needTotal: true,
      }),
    {
      manual: true,
      onBefore() {
        setDiffMsgAll();
      },
    },
  );
  const compareResultDetailListFiltered = useMemo(
    () =>
      onlyFailed
        ? diffMsgAll.compareResultDetailList.filter((item) => item.diffResultCode > 0)
        : diffMsgAll.compareResultDetailList,
    [diffMsgAll, onlyFailed],
  );

  const handleClickRecord = (record: ReplayCaseType) => {
    setSelectedRecord(selectedRecord?.recordId === record.recordId ? undefined : record);
    queryAllDiffMsg({
      recordId: record.recordId,
      replayId: record.replayId,
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
          />
        }
        panel={
          <>
            <SpaceBetweenWrapper style={{ margin: '4px 16px' }}>
              <Space size='large'>
                <div>
                  <Label strong>{t('replay.sceneCount')}</Label>
                  {compareResultDetailListFiltered.length}
                </div>
                <DiffJsonViewTooltip />
              </Space>

              <span>
                <Label>{t('replay.viewFailedOnly')}</Label>
                <Switch size='small' defaultChecked={onlyFailed} onChange={setOnlyFailed} />
              </span>
            </SpaceBetweenWrapper>

            <Divider style={{ margin: '0px 0px -8px' }} />

            <EmptyWrapper
              loading={loadingDiffMsgAll}
              empty={!compareResultDetailListFiltered.length}
              style={{ height: '400px' }}
            >
              <Allotment
                vertical
                css={css`
                  height: ${compareResultDetailListFiltered.length * 400 || 200}px;
                  margin-top: 8px;
                `}
              >
                {compareResultDetailListFiltered.map((data) => (
                  <Allotment.Pane
                    key={data?.id + onlyFailed} // force rerender when onlyFailed change
                    css={css`
                      height: 100%;
                    `}
                  >
                    <DiffScenes
                      hiddenTooltip
                      height={'100%'}
                      appId={props.page.data.appId}
                      operationId={props.page.data.operationId}
                      data={data}
                    />
                  </Allotment.Pane>
                ))}
              </Allotment>
            </EmptyWrapper>
          </>
        }
      />
      <SaveCase operationId={data.operationId} ref={saveCaseRef} />
    </>
  );
};

export default ReplayCasePage;
