import {
  base64Decode,
  DiffJsonView,
  DiffJsonViewProps,
  DiffJsonViewRef,
  DiffMatch,
  EmptyWrapper,
  FlexCenterWrapper,
  getJsonValueByPath,
  jsonIndexPathFilter,
  OnRenderContextMenu,
  SpaceBetweenWrapper,
  TargetEditor,
  tryStringifyJson,
  useTranslation,
} from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { App, Input, Menu, Modal, Spin, theme, Typography } from 'antd';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import { ScheduleService } from '@/services';
import { DiffLog, InfoItem } from '@/services/ReportService';
import { DIFF_TYPE } from '@/services/ScheduleService';

import PathTitle from './CaseDiffTitle';

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

export enum IgnoreType {
  Global,
  Interface,
  Temporary,
}

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
  loading?: boolean;
  data: InfoItem;
  height?: string;
  defaultActiveFirst?: boolean;
  onChange?: (record?: InfoItem, data?: CompareResultDetail) => void;
  onIgnoreKey?: (path: string[], type: IgnoreType) => void;
  onSortKey?: (path: string[]) => void;
}

const CaseDiffViewer: FC<DiffPathViewerProps> = (props) => {
  const { t } = useTranslation('components');
  const { token } = theme.useToken();
  const { message } = App.useApp();

  const [decodeData, setDecodeData] = useState('');

  const jsonDiffViewRef = useRef<DiffJsonViewRef>(null);

  const {
    data: { data: diffMsg, encrypted } = {
      data: {
        id: '',
        categoryName: '',
        operationName: '',
        diffResultCode: 0,
        logInfos: null,
        exceptionMsg: null,
        baseMsg: '',
        testMsg: '',
      },
      encrypted: true,
    },
    loading: loadingDiffMsg,
  } = useRequest(ScheduleService.queryDiffMsgById, {
    defaultParams: [{ id: props.data.id }],
    onSuccess: (data) => {
      props.onChange?.(props.data);
    },
  });

  const {
    data: logEntity,
    loading: loadingLogEntity,
    run: queryLogEntity,
  } = useRequest(
    (logIndex) =>
      ScheduleService.queryLogEntity({
        compareResultId: diffMsg!.id,
        logIndex,
      }),
    {
      manual: true,
      ready: !!diffMsg && props.data.id === diffMsg.id,
      onSuccess: (data) => {
        const leftPath = data.pathPair.leftUnmatchedPath.map((item) => item.nodeName || item.index);
        const rightPath = data.pathPair.rightUnmatchedPath.map(
          (item) => item.nodeName || item.index,
        );
        jsonDiffViewRef.current?.leftScrollTo(leftPath);
        jsonDiffViewRef.current?.rightScrollTo(rightPath);
      },
    },
  );
  useEffect(() => {
    props.defaultActiveFirst &&
      diffMsg?.logInfos?.length &&
      queryLogEntity(diffMsg.logInfos[0].logIndex);
  }, [diffMsg?.id]);

  const handleIgnoreKey = (
    path: string[],
    value: unknown,
    target: TargetEditor,
    type: IgnoreType,
  ) => {
    const filteredPath = jsonIndexPathFilter(
      path,
      target === 'left' ? diffMsg?.baseMsg : diffMsg?.testMsg,
    );
    filteredPath && props.onIgnoreKey?.(filteredPath, type);
  };

  const handleSortKey = (path: string[], value: unknown, target: TargetEditor) => {
    const filteredPath = jsonIndexPathFilter(
      path,
      target === 'left' ? diffMsg?.baseMsg : diffMsg?.testMsg,
    );
    filteredPath && props.onSortKey?.(filteredPath);
  };

  const [modal, contextHolder] = Modal.useModal();
  const handleDiffMatch = useCallback(
    (path: string[]) => {
      const text1 = tryStringifyJson(getJsonValueByPath(diffMsg?.baseMsg, path));
      const text2 = tryStringifyJson(getJsonValueByPath(diffMsg?.testMsg, path));

      modal.info({
        footer: false,
        maskClosable: true,
        width: '50%',
        title: t('replay.diffMatch'),
        content: <DiffMatch text1={text1} text2={text2} />,
      });
    },
    [diffMsg, t],
  );
  const handleNodeDecode = (value: string) => {
    try {
      setDecodeData(base64Decode(value));
    } catch (e) {
      console.error(e);
      message.error(t('jsonDiff.failedToDecodeBase64'));
      return;
    }
  };

  const contextMenuRender: OnRenderContextMenu = (path, value, target) => [
    {
      type: 'row',
      items: [
        {
          type: 'column',
          items: [
            {
              type: 'dropdown-button',
              width: '10em',
              main: {
                type: 'button',
                text: t('jsonDiff.ignore')!,
                // disabled: isObjectOrArray(getJsonValueByPath(diffJson.left, context.selection.path)),
                onClick: () => handleIgnoreKey(path, value, target, IgnoreType.Global),
              },
              items: [
                {
                  type: 'button',
                  text: t('jsonDiff.ignoreToGlobal')!,
                  onClick: () => handleIgnoreKey(path, value, target, IgnoreType.Global),
                },
                {
                  type: 'button',
                  text: t('jsonDiff.ignoreToInterfaceOrDependency')!,
                  onClick: () => handleIgnoreKey(path, value, target, IgnoreType.Interface),
                },
                {
                  type: 'button',
                  text: t('jsonDiff.ignoreTemporary')!,
                  onClick: () => handleIgnoreKey(path, value, target, IgnoreType.Temporary),
                },
              ],
            },
            {
              type: 'button',
              text: t('jsonDiff.sort')!,
              onClick: () => handleSortKey(path, value, target),
            },
            {
              type: 'button',
              text: t('jsonDiff.diffMatch')!,
              onClick: () => handleDiffMatch(path),
            },
            {
              type: 'button',
              text: t('jsonDiff.decode')!,
              onClick: () => handleNodeDecode(value as string),
            },
          ],
        },
      ],
    },
  ];

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
                  {t('replay.pointOfDifference')}
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
                ref={jsonDiffViewRef}
                height={`calc(${props.height} - 8px)`}
                hiddenValue={encrypted}
                diffJson={{
                  left: diffMsg?.baseMsg || '',
                  right: diffMsg?.testMsg || '',
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
                onRenderContextMenu={contextMenuRender}
              />
            </div>
          )}
        </Allotment.Pane>
      </Allotment>

      {/* JsonDiffMatchModal */}
      {contextHolder}

      {/* NodeDecodeModal */}
      <Modal
        destroyOnClose
        footer={false}
        open={!!decodeData}
        title={t('base64DecodeContent')}
        onCancel={() => setDecodeData('')}
      >
        <Input.TextArea readOnly value={decodeData} />
      </Modal>
    </EmptyWrapper>
  );
};

export default CaseDiffViewer;
