import {
  base64Decode,
  ContextMenuItem,
  DiffJsonView,
  DiffJsonViewProps,
  DiffJsonViewRef,
  DiffMatch,
  EmptyWrapper,
  FlexCenterWrapper,
  getJsonValueByPath,
  JSONEditor,
  jsonIndexPathFilter,
  Label,
  OnRenderContextMenu,
  removeAllArrayInObject,
  SpaceBetweenWrapper,
  TagBlock,
  TargetEditor,
  tryStringifyJson,
  useTranslation,
} from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { App, Flex, Input, Menu, Modal, Spin, theme, Typography } from 'antd';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ScheduleService } from '@/services';
import { DiffLog, InfoItem } from '@/services/ReportService';
import { DIFF_TYPE } from '@/services/ScheduleService';
import { isObjectOrArray } from '@/utils';

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

  const [openConditionalIgnore, setOpenConditionalIgnore] = useState(false);

  const [decodeData, setDecodeData] = useState('');

  const [arrayElement, setArrayElement] = useState<{
    json: string; // Json string
    element: any; // Nearest superior array element to the ignored node
    basePath: string[]; // Element path in json
    relativePath: string[]; // Path relative to the elements
  }>();
  const [referencePath, setReference] = useState<{ path: string[]; value: string }>();
  const fullPath = useMemo(
    () =>
      referencePath?.path.length
        ? jsonIndexPathFilter(arrayElement?.basePath, arrayElement?.json)
            .concat(`[${referencePath.path.join('/')}=${referencePath.value}]`)
            .concat(jsonIndexPathFilter(arrayElement?.relativePath, arrayElement?.element))
        : [],
    [arrayElement, referencePath],
  );

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

  const handleConditionalIgnoreKey = (path: string[], value: unknown, target: TargetEditor) => {
    const json = target === 'left' ? diffMsg?.baseMsg : diffMsg?.testMsg;
    let arrayElement: any = undefined;
    const basePath: string[] = [];
    const relativePath: string[] = [];

    for (let index = path.length - 1; index > 0; index--) {
      const slicedPath = path.slice(0, index);
      const node = getJsonValueByPath(json, slicedPath);

      if (Array.isArray(node)) {
        arrayElement = removeAllArrayInObject((node as Array<any>)[Number(path[index])]); // TODO filter Array
        basePath.push(...slicedPath);
        relativePath.push(...path.slice(index + 1));
        break;
      }
    }

    if (arrayElement === undefined) return message.error(t('replayCase.preciseIgnoreError'));
    setArrayElement({ json, element: arrayElement, basePath, relativePath });
    setOpenConditionalIgnore(true);
  };

  const handleCreateConditionalIgnoreKey = () => {
    if (referencePath?.path.length) {
      fullPath.length && props.onIgnoreKey?.(fullPath, IgnoreType.Interface);
      resetConditionalIgnoreModal();
    } else {
      message.error(t('replayCase.selectConditionNode'));
    }
  };

  const resetConditionalIgnoreModal = () => {
    setOpenConditionalIgnore(false);
    setReference(undefined);
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

  const contextMenuRender: OnRenderContextMenu = (path, value, target) => {
    const isArrayNode = Array.isArray(value);
    const isLeafNode = value !== undefined && !isObjectOrArray(value);
    const isRootNode = !path?.length;

    return [
      {
        type: 'row',
        items: [
          {
            type: 'column',
            items: ([] as ContextMenuItem[])
              .concat(
                isRootNode
                  ? []
                  : [
                      {
                        type: 'dropdown-button',
                        width: 'max-content',
                        main: {
                          type: 'button',
                          text: t('jsonDiff.ignore')!,
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
                            onClick: () =>
                              handleIgnoreKey(path, value, target, IgnoreType.Interface),
                          },
                          {
                            type: 'button',
                            text: t('jsonDiff.temporaryIgnore')!,
                            onClick: () =>
                              handleIgnoreKey(path, value, target, IgnoreType.Temporary),
                          },
                          {
                            type: 'button',
                            text: t('jsonDiff.conditionalIgnore')!,
                            disabled: Array.isArray(value), // TODO disabled when not in array
                            onClick: () => handleConditionalIgnoreKey(path, value, target),
                          },
                        ],
                      },
                    ],
              )
              .concat(
                isArrayNode
                  ? [
                      {
                        type: 'button',
                        text: t('jsonDiff.sort')!,
                        onClick: () => handleSortKey(path, value, target),
                      },
                    ]
                  : [],
              )
              .concat(
                isLeafNode || isRootNode
                  ? [
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
                    ]
                  : [],
              ),
          },
        ],
      },
    ] as ContextMenuItem[];
  };

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

      {/* ConditionalIgnoreKeyModal */}
      <Modal
        destroyOnClose
        open={openConditionalIgnore}
        width='60%'
        title={t('replayCase.conditionalIgnore')}
        onOk={handleCreateConditionalIgnoreKey}
        onCancel={resetConditionalIgnoreModal}
      >
        <div
          css={css`
            .json-conditional-ignore-node {
              background-color: ${token.colorErrorBgHover};
            }
            .json-ignore-reference-node {
              background-color: ${token.colorSuccessBgHover};
            }
            .json-conditional-ignore-node.json-ignore-reference-node {
              background: linear-gradient(
                to bottom,
                ${token.colorErrorBgHover} 0%,
                ${token.colorErrorBgHover} 50%,
                ${token.colorSuccessBgHover} 50%,
                ${token.colorSuccessBgHover} 100%
              );
            }
          `}
        >
          <Flex justify='space-between' align={'center'} style={{ marginBottom: '8px' }}>
            <Flex>
              <TagBlock color={token.colorErrorBgHover} title={t('replayCase.ignoreNode')} />
              <TagBlock color={token.colorSuccessBgHover} title={t('replayCase.conditionNode')} />
            </Flex>
          </Flex>

          <JSONEditor
            readOnly
            height='400px'
            content={{ json: arrayElement?.element }}
            onClassName={(path) => {
              if (
                path?.join(',') === arrayElement?.relativePath.join(',') &&
                path?.join(',') === referencePath?.path.join(',')
              )
                return 'json-conditional-ignore-node json-ignore-reference-node';
              if (path?.join(',') === arrayElement?.relativePath.join(','))
                return 'json-conditional-ignore-node';
              if (referencePath?.path.join(',') === path?.join(','))
                return 'json-ignore-reference-node';
            }}
            onSelect={(context) => {
              const isLeafNode = !!context.value && !isObjectOrArray(context.value);
              setReference(() =>
                isLeafNode
                  ? { path: context.selection.path, value: String(context.value) }
                  : undefined,
              );
            }}
          />
        </div>
        <div style={{ flex: 1, marginTop: '12px' }}>
          <Label>{t('replayCase.ignorePath')}</Label>
          {fullPath.length ? (
            <Typography.Text>{fullPath.join('/')}</Typography.Text>
          ) : (
            <Typography.Text type='secondary'>
              {t('replayCase.selectConditionNodeTip')}
            </Typography.Text>
          )}
        </div>

        <Label style={{ opacity: 0 }}>{t('replayCase.ignorePath')}</Label>
        {!!fullPath.length && (
          <Typography.Text type='secondary'>
            {'IGNORE '}
            <Typography.Text code>
              {jsonIndexPathFilter(arrayElement?.relativePath, arrayElement?.element).join('/')}
            </Typography.Text>
            {' WHEN '}
            <Typography.Text code>
              {`${referencePath?.path.join('/')} = ${referencePath?.value}`}
            </Typography.Text>
          </Typography.Text>
        )}
      </Modal>
    </EmptyWrapper>
  );
};

export default CaseDiffViewer;
