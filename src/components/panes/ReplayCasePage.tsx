import { InfoCircleOutlined } from '@ant-design/icons';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Col, Collapse, Row, Switch } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ReplayService from '../../services/Replay.service';
import { PlanItemStatistics, ReplayCase as ReplayCaseType } from '../../services/Replay.type';
import useUserProfile from '../../store/useUserProfile';
import { CaseTable, SaveCase, SaveCaseRef } from '../replay/Case';
import {
  CheckOrCloseIcon,
  CollapseTable,
  Label,
  PanesTitle,
  SpaceBetweenWrapper,
  WatermarkCodeMirror,
} from '../styledComponents';
import { PageFC } from './index';

const { Panel } = Collapse;
const InfoIcon = styled(InfoCircleOutlined)`
  color: ${(props) => props.theme.colorError};
  margin-right: 8px;
`;

const ReplayCasePage: PageFC<PlanItemStatistics> = (props) => {
  const { theme } = useUserProfile();
  const { t } = useTranslation(['components']);

  const [onlyFailed, setOnlyFailed] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReplayCaseType>();

  const saveCaseRef = useRef<SaveCaseRef>(null);

  const { data: compareResults = [], mutate } = useRequest(
    () =>
      ReplayService.queryFullLinkMsg({
        recordId: selectedRecord!.recordId,
        planItemId: props.page.data!.planItemId,
      }),
    {
      ready: !!selectedRecord,
      refreshDeps: [selectedRecord?.recordId],
      onError() {
        mutate([]);
      },
    },
  );

  const compareResultsFiltered = useMemo(
    () => compareResults.filter((item) => !onlyFailed || item.diffResultCode !== 0),
    [onlyFailed, compareResults],
  );

  const handleClickRecord = (record: ReplayCaseType) => {
    setSelectedRecord(selectedRecord?.recordId === record.recordId ? undefined : record);
  };

  function handleClickSaveCase(record: ReplayCaseType) {
    saveCaseRef.current?.openModal(record);
  }

  return (
    <>
      <PanesTitle
        title={
          <span>
            {t('replay.caseServiceAPI')}: {props.page.data.operationName}
          </span>
        }
      />

      <CollapseTable
        active={!!selectedRecord}
        table={
          <CaseTable
            planItemId={props.page.data.planItemId}
            onClick={handleClickRecord}
            onClickSaveCase={handleClickSaveCase}
          />
        }
        panel={
          <>
            <SpaceBetweenWrapper style={{ margin: '8px' }}>
              <div>
                <Label>Total Count</Label>
                {compareResults.length}
              </div>
              <span>
                <Label>{t('replay.viewFailedOnly')}</Label>
                <Switch size='small' defaultChecked={onlyFailed} onChange={setOnlyFailed} />
              </span>
            </SpaceBetweenWrapper>

            <Collapse>
              {compareResultsFiltered.map((result, i) =>
                result.diffResultCode === 2 ? (
                  <Panel
                    header={
                      <span>
                        <InfoIcon />
                        {result.logs?.length && result.logs[0].logInfo}
                      </span>
                    }
                    key={i}
                  />
                ) : (
                  <Panel
                    header={
                      <span>
                        <CheckOrCloseIcon size={14} checked={!result.diffResultCode} />
                        {result?.operationName}
                      </span>
                    }
                    key={i}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        {/*解决无法渲然全的bug，误删*/}
                        <div
                          css={css`
                            height: 1px;
                          `}
                        ></div>
                        <WatermarkCodeMirror
                          readOnly
                          height='300px'
                          themeKey={theme}
                          extensions={[javascript(), html(), json()]}
                          value={result.baseMsg}
                          remark={t('replay.benchmark')}
                        />
                      </Col>
                      <Col span={12}>
                        {/*解决无法渲然全的bug，误删*/}
                        <div
                          css={css`
                            height: 1px;
                          `}
                        ></div>
                        <WatermarkCodeMirror
                          readOnly
                          height='300px'
                          themeKey={theme}
                          extensions={[javascript(), html(), json()]}
                          value={result.testMsg}
                          remark={t('replay.test')}
                        />
                      </Col>
                    </Row>
                  </Panel>
                ),
              )}
            </Collapse>
          </>
        }
      />
      <SaveCase operationId={props.page.data.operationId} ref={saveCaseRef} />
    </>
  );
};

export default ReplayCasePage;
