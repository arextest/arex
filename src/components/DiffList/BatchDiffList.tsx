import { DiffOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Badge, Card, Modal, Space, Tag, Tooltip, Typography } from 'antd';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FileSystemService } from '../../services/FileSystem.service';
import ReplayService from '../../services/Replay.service';
import { QueryMsgWithDiffReq, QueryMsgWithDiffRes, Scene } from '../../services/Replay.type';
import { DiffMatch, TooltipButton } from '../index';

const PathTooltip: FC<{ path?: string | null }> = (props) => {
  const path = useMemo(() => props.path?.split('.') || [], [props.path]);

  return (
    <Tooltip title={props.path} open={path.length > 1 ? undefined : false}>
      <Typography.Text code>{path.at(-1)}</Typography.Text>
    </Tooltip>
  );
};

export type DiffListType = {
  appId: string;
  operationId: string;
  scene?: Scene;
  onTreeModeClick?: (diff?: QueryMsgWithDiffRes) => void;
  externalData?: Partial<QueryMsgWithDiffReq>;
};

const BatchDiffList: FC<DiffListType> = (props) => {
  const { t } = useTranslation(['components']);

  const [modal, contextHolder] = Modal.useModal();

  const DiffMap: {
    [unmatchedType: string]: {
      text: string;
      color: string;
      desc?: string;
    };
  } = useMemo(() => {
    return {
      '0': {
        text: t('replay.unknown'),
        color: 'default',
      },
      '1': {
        text: t('replay.leftMissing'),
        color: 'orange',
        desc: t('replay.leftMissingDesc'),
      },
      '2': {
        text: t('replay.rightMissing'),
        color: 'blue',
        desc: t('replay.rightMissingDesc'),
      },
      '3': {
        text: t('replay.differentValue'),
        color: 'magenta',
      },
    };
  }, []);
  const { data: diffDataFromRequest, loading } = useRequest(
    () =>
      ReplayService.queryMsgWithDiff({
        compareResultId: props.scene!.compareResultId,
        logIndexes: props.scene!.logIndexes,
      }),
    {
      ready: !!props.scene,
      refreshDeps: [props.scene],
    },
  );

  const diffData = useMemo(() => {
    return props.externalData || diffDataFromRequest;
  }, [props.externalData, diffDataFromRequest]);

  return (
    <Card
      size='small'
      title={!loading && `${diffData?.logs?.length} ${t('replay.issues')}`}
      loading={loading}
      style={{ minHeight: '56px' }}
    >
      <Space direction='vertical' style={{ width: '100%' }}>
        {diffData?.logs?.map((log, index) => (
          <div key={index} style={{ display: 'flex', flexFlow: 'row nowrap' }}>
            <Badge size={'small'} count={props?.externalData?.errorCount?.[index]}>
              <Tag
                color={DiffMap[log.pathPair.unmatchedType]?.color}
                style={{ height: 'fit-content' }}
              >
                {DiffMap[log.pathPair.unmatchedType]?.text}
              </Tag>
            </Badge>
            <div
              css={css`
                margin-left: 24px;
              `}
            ></div>
            {log.pathPair.unmatchedType === 3 ? (
              <Typography.Text type='secondary'>
                {` ${t('appSetting.path')} `}
                <PathTooltip path={log.path} />
                {` ${t('replay.isDifferenceExcepted')} `}
                <Typography.Text code ellipsis style={{ maxWidth: '200px' }}>
                  {log.baseValue.toString()}
                </Typography.Text>
                {`${t('replay.actual')} `}
                <Typography.Text code ellipsis style={{ maxWidth: '200px' }}>
                  {log.testValue.toString()}
                </Typography.Text>
                {'.'}
              </Typography.Text>
            ) : (
              <Typography.Text type='secondary'>
                <PathTooltip path={log.path} /> {DiffMap[log.pathPair.unmatchedType].desc}
              </Typography.Text>
            )}

            <Space style={{ float: 'right', marginLeft: 'auto' }}>
              <TooltipButton
                size='small'
                type='default'
                breakpoint='xxl'
                title={t('replay.diffMatch')}
                icon={<DiffOutlined />}
                onClick={() =>
                  modal.info({
                    title: t('replay.diffMatch'),
                    width: 800,
                    maskClosable: true,
                    content: <DiffMatch text1={log.baseValue} text2={log.testValue} />,
                  })
                }
              />
              <TooltipButton
                size='small'
                type='default'
                breakpoint='xxl'
                title={t('replay.treeMode')}
                onClick={() => {
                  if (props.externalData?.logIds) {
                    FileSystemService.queryBatchCompareCaseMsgWithDiff({
                      logId: props.externalData?.logIds[index],
                    }).then((res: any) => {
                      props.onTreeModeClick?.({
                        ...res,
                        logs: [res.logEntity],
                      });
                    });
                  }
                }}
              >
                {t('replay.treeMode')}
              </TooltipButton>
            </Space>
          </div>
        ))}
      </Space>

      {contextHolder}
    </Card>
  );
};

export default BatchDiffList;
