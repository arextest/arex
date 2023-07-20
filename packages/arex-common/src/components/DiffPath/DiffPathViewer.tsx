import {
  DiffJsonView,
  DiffJsonViewProps,
  EmptyWrapper,
  FlexCenterWrapper,
  SpaceBetweenWrapper,
} from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { Menu, Spin, theme, Typography } from 'antd';
import React, { FC, useEffect } from 'react';

import { useTranslation } from '../../hooks';
import PathTitle from './DiffPathTitle';
import { DiffLog, InfoItem, LogEntity } from './type';

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
  loading?: boolean;
  data: InfoItem;
  height?: string;
  defaultActiveFirst?: boolean;
  onChange?: (record?: InfoItem, data?: CompareResultDetail) => void;
  requestDiffMsg: (params: any, record?: InfoItem) => Promise<CompareResultDetail>;
  requestQueryLogEntity: (params: {
    compareResultId: string;
    logIndex: number;
  }) => Promise<LogEntity[]>;
}

const DiffPathViewer: FC<DiffPathViewerProps> = (props) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const { data: diffMsg, loading: loadingDiffMsg } = useRequest(props.requestDiffMsg, {
    defaultParams: [{ id: props.data.id }],
    onSuccess: (data) => {
      props.onChange?.(props.data);
    },
  });

  const {
    data: logEntity = [],
    loading: loadingLogEntity,
    run: queryLogEntity,
  } = useRequest(
    (logIndex) =>
      props.requestQueryLogEntity({
        compareResultId: diffMsg!.id,
        logIndex,
      }),
    {
      manual: true,
      ready: !!diffMsg && props.data.id === diffMsg.id,
    },
  );

  useEffect(() => {
    props.defaultActiveFirst &&
      diffMsg?.logInfos?.length &&
      queryLogEntity(diffMsg.logInfos[0].logIndex);
  }, [diffMsg?.id]);

  return (
    <EmptyWrapper loading={loadingDiffMsg} empty={!diffMsg}>
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
          {diffMsg && [0, 2].includes(diffMsg?.diffResultCode) ? (
            <FlexCenterWrapper>
              <Typography.Text type='secondary'>
                {SummaryCodeMap[diffMsg?.diffResultCode].message}
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
                items={diffMsg?.logInfos?.map((log, index) => {
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
                  diffMsg?.logInfos?.length &&
                    queryLogEntity(diffMsg.logInfos[parseInt(key)].logIndex);
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
          {diffMsg?.diffResultCode === 2 ? (
            <FlexCenterWrapper style={{ padding: '16px' }}>
              <Typography.Text type='secondary'>{diffMsg.exceptionMsg}</Typography.Text>
            </FlexCenterWrapper>
          ) : (
            <div style={{ position: 'relative', margin: `${token.marginXS}px`, height: '100%' }}>
              <DiffJsonView
                hiddenTooltip
                readOnly={props.contextMenuDisabled}
                diffJson={{
                  left: diffMsg?.baseMsg || '',
                  right: diffMsg?.testMsg || '',
                }}
                diffPath={logEntity}
                {...props}
                height={`calc(${props.height} - 8px)`}
              />
            </div>
          )}
        </Allotment.Pane>
      </Allotment>
    </EmptyWrapper>
  );
};

export default DiffPathViewer;
