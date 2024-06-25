import {
  DiffJsonView,
  DiffJsonViewRef,
  EmptyWrapper,
  FlexCenterWrapper,
  SpaceBetweenWrapper,
  useTranslation,
} from '@arextest/arex-core';
import { ArexRESTResponse } from '@arextest/arex-request';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { Menu, theme, Typography } from 'antd';
import React, { FC, useMemo, useRef, useState } from 'react';

import PathTitle from '@/panes/ReplayCase/CaseDiff/CaseDiffTitle';
import { SummaryCodeMap } from '@/panes/ReplayCase/CaseDiff/CaseDiffViewer';
import { ScheduleService } from '@/services';
import { RecordResult } from '@/services/ReportService';
import { CompareMsgRes, DIFF_TYPE } from '@/services/ScheduleService';

export interface CompareProps {
  getResponse?: () => ArexRESTResponse | undefined;
  entryMock?: RecordResult;
  onGetDiff?: (diffs: CompareMsgRes['logDetails']) => void;
}

const Compare: FC<CompareProps> = (props) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const jsonDiffViewRef = useRef<DiffJsonViewRef>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const { data: diffMsg, loading } = useRequest(
    () =>
      ScheduleService.compareMsg({
        appId: props.entryMock?.appId as string,
        operationName: props?.entryMock?.operationName as string,
        baseMsg: props.getResponse?.()?.body,
        testMsg: props?.entryMock?.targetResponse.body as string,
      }),
    {
      ready: !!props.getResponse,
      onSuccess(diffMsg) {
        props.onGetDiff(diffMsg.logDetails);
        setTimeout(() => scrollToIndex(0, diffMsg));
      },
    },
  );

  const logEntity = useMemo(
    () => diffMsg?.logDetails?.[activeIndex]?.logEntity,
    [diffMsg, activeIndex],
  );

  const scrollToIndex = (index: number, diffMsg?: CompareMsgRes) => {
    setActiveIndex(index);
    const pathPair = diffMsg?.logDetails?.[index]?.logEntity?.pathPair;
    if (!pathPair) return;

    const leftPath = pathPair.leftUnmatchedPath.map((item) => item.nodeName || item.index);
    const rightPath = pathPair.rightUnmatchedPath.map((item) => item.nodeName || item.index);
    jsonDiffViewRef.current?.leftScrollTo(leftPath);
    jsonDiffViewRef.current?.rightScrollTo(rightPath);
  };

  return (
    <>
      <EmptyWrapper loading={loading} empty={!diffMsg} css={{ overflow: 'hidden' }}>
        <Allotment
          css={css`
            height: 100%;
            padding: 8px 0;
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
                    {t('components:replay.pointOfDifference')}
                  </Typography.Text>
                </SpaceBetweenWrapper>

                <Menu
                  defaultSelectedKeys={['0']}
                  items={diffMsg?.logDetails?.map((log, index) => {
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
                  onClick={({ key }) => scrollToIndex(Number(key), diffMsg)}
                />
              </>
            )}
          </Allotment.Pane>

          <Allotment.Pane
            visible
            className='json-diff-viewer'
            css={css`
              height: 100%;
            `}
          >
            {diffMsg?.diffResultCode === 2 ? (
              <FlexCenterWrapper style={{ padding: '16px' }}>
                <Typography.Text type='secondary'>{diffMsg?.exceptionMsg}</Typography.Text>
              </FlexCenterWrapper>
            ) : (
              <div style={{ position: 'relative', margin: `${token.marginXS}px`, height: '100%' }}>
                <DiffJsonView
                  ref={jsonDiffViewRef}
                  height={`calc(100% - 4px)`}
                  diffJson={{
                    left: diffMsg?.baseMsg || '',
                    right: diffMsg?.testMsg || '',
                  }}
                  remarks={{
                    left: t('common:realtime'),
                    right: t('common:record'),
                  }}
                  onClassName={(path, value, target) =>
                    logEntity?.pathPair[`${target}UnmatchedPath`]
                      .map((item) => item.nodeName || item.index.toString())
                      .join(',') === path.join(',')
                      ? logEntity?.pathPair.unmatchedType === DIFF_TYPE.UNMATCHED
                        ? 'json-difference-node'
                        : 'json-additional-node'
                      : ''
                  }
                  onRenderContextMenu={() => false}
                />
              </div>
            )}
          </Allotment.Pane>
        </Allotment>
      </EmptyWrapper>
    </>
  );
};

export default Compare;
