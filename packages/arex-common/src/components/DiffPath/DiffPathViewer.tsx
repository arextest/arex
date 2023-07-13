import {
  DiffJsonView,
  DiffJsonViewProps,
  FlexCenterWrapper,
  SpaceBetweenWrapper,
} from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { App, Menu, Spin, theme, Typography } from 'antd';
import React, { FC, useEffect } from 'react';

import { useTranslation } from '../../hooks';
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
export interface DiffPathViewerProps extends DiffJsonViewProps {
  contextMenuDisabled?: boolean;
  operationId: string;
  appId: string;
  loading?: boolean;
  data?: CompareResultDetail;
  height?: string;
  defaultActiveFirst?: boolean;
  requestQueryLogEntity: (params: {
    compareResultId: string;
    logIndex: number;
  }) => Promise<LogEntity[]>;
}

const DiffPathViewer: FC<DiffPathViewerProps> = (props) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { message } = App.useApp();

  const {
    data: logEntity = [],
    loading: loadingLogEntity,
    run: queryLogEntity,
  } = useRequest(
    (logIndex) =>
      props.requestQueryLogEntity({
        compareResultId: props.data!.id,
        logIndex,
      }),
    {
      manual: true,
      ready: !!props.data,
    },
  );

  useEffect(() => {
    props.defaultActiveFirst &&
      props.data?.logInfos?.length &&
      queryLogEntity(props.data.logInfos[0].logIndex);
  }, [props.data]);

  if (!props.data) return null;

  return (
    <Allotment
      css={css`
        height: ${props.height};
        overflow: visible !important;
        .split-view-view-visible:has(.json-diff-viewer) {
          overflow: visible !important;
        }
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
            <SpaceBetweenWrapper>
              <Typography.Text
                type='secondary'
                style={{
                  display: 'inline-block',
                  margin: `${token.marginSM}px 0 0 ${token.margin}px`,
                }}
              >
                {t('diffPath.pointOfDifference')}
              </Typography.Text>
              <Spin
                size='small'
                spinning={loadingLogEntity}
                css={css`
                  margin-right: 8px;
                  span {
                    font-size: 16px !important;
                  }
                `}
              />
            </SpaceBetweenWrapper>
            <Menu
              defaultSelectedKeys={props.defaultActiveFirst ? ['0'] : undefined}
              items={props.data.logInfos?.map((log, index) => {
                return {
                  label: <PathTitle diffLog={log} />,
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
                props.data?.logInfos?.length &&
                  queryLogEntity(props.data.logInfos[parseInt(key)].logIndex);
              }}
            />
          </>
        )}
      </Allotment.Pane>

      <Allotment.Pane
        visible
        className='json-diff-viewer'
        css={css`
          height: ${props.height};
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
              readOnly={props.contextMenuDisabled}
              diffJson={{
                left: props.data.baseMsg,
                right: props.data.testMsg,
              }}
              diffPath={logEntity}
              {...props}
              height={`calc(${props.height} - 8px)`}
            />
          </div>
        )}
      </Allotment.Pane>
    </Allotment>
  );
};

export default DiffPathViewer;
