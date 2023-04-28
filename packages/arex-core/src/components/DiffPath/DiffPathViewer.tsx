import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { App, Menu, theme, Typography } from 'antd';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import DiffJsonView from '../DiffJsonView';
import { FlexCenterWrapper } from '../index';
import PathTitle from './DiffPathTitle';
import { DiffLog, LogEntity } from './type';

export const SummaryCodeMap: { [key: string]: { color: string; message: string } } = {
  '0': {
    color: 'success',
    message: 'SUCCESS', // 'COMPARED_WITHOUT_DIFFERENCE'
  },
  '1': {
    color: 'magenta',
    message: 'COMPARED_WITH_DIFFERENCE',
  },
  '2': {
    color: 'error',
    message: 'EXCEPTION', // 'COMPARED_INTERNAL_EXCEPTION'
  },
  '3': {
    color: 'orange',
    message: 'SEND_FAILED_NOT_COMPARE',
  },
};

export type CompareResultDetail = {
  id: string;
  categoryName: string;
  operationName: string;
  diffResultCode: number;
  logInfos: DiffLog[] | null;
  exceptionMsg: string | null;
  baseMsg: string;
  testMsg: string;
};
export interface DiffPathViewerProps {
  operationId: string;
  appId: string;
  data: CompareResultDetail;
  diffPath?: LogEntity[];
  height?: string;
  defaultActiveFirst?: boolean;
  onQueryLogEntity: (params: { compareResultId: string; logIndex: number }) => Promise<LogEntity[]>;
  onIgnoreNode: (path: string[]) => Promise<boolean>;
}

const DiffPathViewer: FC<DiffPathViewerProps> = (props) => {
  const { t } = useTranslation(['components']);
  const { token } = theme.useToken();
  const { message } = App.useApp();

  const { data: logEntity = [], run: queryLogEntity } = useRequest(
    (logIndex) =>
      props.onQueryLogEntity({
        compareResultId: props.data.id,
        logIndex,
      }),
    {
      manual: true,
    },
  );

  useEffect(() => {
    props.defaultActiveFirst &&
      props.data.logInfos?.length &&
      queryLogEntity(props.data.logInfos[0].logIndex);
  }, [props.data]);

  const { run: insertIgnoreNode } = useRequest(props.onIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success(t('replay.addIgnoreSuccess'));
      }
    },
  });

  function handleIgnoreNode(diffLog: DiffLog) {
    const path = diffLog.nodePath.map((p) => p.nodeName).filter(Boolean);

    insertIgnoreNode(path);
  }

  if (!props.data) return null;

  return (
    <Allotment
      css={css`
        height: ${props.height};
      `}
    >
      <Allotment.Pane preferredSize={200}>
        {[0, 2].includes(props.data?.diffResultCode) ? (
          <FlexCenterWrapper>
            <Typography.Text type='secondary'>
              {SummaryCodeMap[props.data?.diffResultCode].message}
            </Typography.Text>
          </FlexCenterWrapper>
        ) : (
          <>
            <Typography.Text
              type='secondary'
              style={{
                display: 'inline-block',
                margin: `${token.marginSM}px 0 0 ${token.margin}px`,
              }}
            >
              {t('replay.pointOfDifference')}
            </Typography.Text>
            <Menu
              defaultSelectedKeys={props.defaultActiveFirst ? ['0'] : undefined}
              items={props.data.logInfos?.map((log, index) => {
                return {
                  label: <PathTitle diffLog={log} onIgnore={handleIgnoreNode} />,
                  key: index,
                };
              })}
              css={css`
                height: 100%;
                overflow-y: auto;
                padding: 4px 8px 0;
                .ant-menu-item {
                  height: 26px;
                  line-height: 26px;
                }
                border-inline-end: none !important;
              `}
              onClick={({ key }) => {
                props.data.logInfos?.length &&
                  queryLogEntity(props.data.logInfos[parseInt(key)].logIndex);
              }}
            />
          </>
        )}
      </Allotment.Pane>

      <Allotment.Pane
        visible
        css={css`
          height: ${props.height};
          border-left: 1px solid ${token.colorBorderBg};
        `}
      >
        {props.data?.diffResultCode === 2 ? (
          <FlexCenterWrapper style={{ padding: '16px' }}>
            <Typography.Text type='secondary'>{props.data.exceptionMsg}</Typography.Text>
          </FlexCenterWrapper>
        ) : (
          <div style={{ position: 'relative', margin: `${token.marginXS}px`, height: '100%' }}>
            <DiffJsonView
              hiddenTooltip
              height={`calc(${props.height} - 16px)`}
              diffJson={{
                left: props.data.baseMsg,
                right: props.data.testMsg,
              }}
              diffPath={logEntity}
            />
          </div>
        )}
      </Allotment.Pane>
    </Allotment>
  );
};

export default DiffPathViewer;
