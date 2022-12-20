import { InfoCircleOutlined } from '@ant-design/icons';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import CodeMirror from '@uiw/react-codemirror';
import { ReactCodeMirrorProps } from '@uiw/react-codemirror/src';
import { useRequest } from 'ahooks';
import { Col, Collapse, Row, Space, Switch } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import { CaseTable, SaveCase, SaveCaseRef } from '../components/replay/Case';
import {
  CheckOrCloseIcon,
  CollapseTable,
  Label,
  PanesTitle,
  WatermarkCodeMirror,
} from '../components/styledComponents';
import ReplayService from '../services/Replay.service';
import { PlanItemStatistics, ReplayCase as ReplayCaseType } from '../services/Replay.type';
import useUserProfile from '../store/useUserProfile';
import { Theme } from '../theme';
import { PageFC } from './index';

const { Panel } = Collapse;
const InfoIcon = styled(InfoCircleOutlined)`
  color: ${(props) => props.theme.colorError};
  margin-right: 8px;
`;

const ReplayCasePage: PageFC<PlanItemStatistics> = (props) => {
  const { theme } = useUserProfile();

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
    <Space direction='vertical' style={{ display: 'flex', paddingBottom: '16px' }}>
      <PanesTitle
        title={<span>Main Service API: {props.page.data.operationName}</span>}
        extra={
          <span>
            <Label>View Failed Only</Label>
            <Switch size='small' defaultChecked={onlyFailed} onChange={setOnlyFailed} />
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
                        remark='Benchmark'
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
                        remark='Test'
                      />
                    </Col>
                  </Row>
                </Panel>
              ),
            )}
          </Collapse>
        }
      />
      <SaveCase operationId={props.page.data.planItemId} ref={saveCaseRef} />
    </Space>
  );
};

export default ReplayCasePage;
