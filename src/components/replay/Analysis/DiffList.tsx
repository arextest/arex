import { DiffOutlined, StopOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, Button, Card, Modal, Space, Tag, Tooltip, Typography } from 'antd';
import React, { FC, useMemo } from 'react';

import AppSettingService from '../../../services/AppSetting.service';
import ReplayService from '../../../services/Replay.service';
import {
  QueryMsgWithDiffLog,
  QueryMsgWithDiffReq,
  QueryMsgWithDiffRes,
  Scene,
} from '../../../services/Replay.type';
import { DiffMatch, TooltipButton } from '../../index';

const DiffMap: {
  [unmatchedType: string]: {
    text: string;
    color: string;
    desc?: string;
  };
} = {
  '0': {
    text: 'Unknown',
    color: 'default',
  },
  '1': {
    text: 'Left Missing',
    color: 'orange',
    desc: 'is missing on the left',
  },
  '2': {
    text: 'Right Missing',
    color: 'blue',
    desc: 'is missing on the right',
  },
  '3': {
    text: 'Different Value',
    color: 'magenta',
  },
};

const PathTooltip: FC<{ path: string }> = (props) => {
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
  externalData: QueryMsgWithDiffReq;
};

const DiffList: FC<DiffListType> = (props) => {
  const { message } = App.useApp();
  const [modal, contextHolder] = Modal.useModal();

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

  const { run: insertIgnoreNode } = useRequest(
    (path) =>
      AppSettingService.insertIgnoreNode({
        operationId: props.operationId,
        appId: props.appId,
        exclusions: path,
      }),
    {
      manual: true,
      onSuccess(success) {
        if (success) {
          message.success('Ignore node successfully');
        }
      },
    },
  );

  function handleIgnoreNode(pathPair: QueryMsgWithDiffLog['pathPair']) {
    const unmatchedType = pathPair.unmatchedType;
    const path = pathPair[unmatchedType === 2 ? 'rightUnmatchedPath' : 'leftUnmatchedPath']
      .map((p) => p.nodeName)
      .filter(Boolean);

    insertIgnoreNode(path);
  }

  return (
    <Card
      size='small'
      title={!loading && `${diffData?.logs.length} issue(s)`}
      extra={
        <Button
          size='small'
          disabled={loading}
          onClick={() => props.onTreeModeClick?.(diffData)}
          style={{ marginLeft: '8px' }}
        >
          Tree Mode
        </Button>
      }
      loading={loading}
      style={{ minHeight: '56px' }}
    >
      <Space direction='vertical' style={{ width: '100%' }}>
        {diffData?.logs.map((log, index) => (
          <div key={index} style={{ display: 'flex', flexFlow: 'row nowrap' }}>
            <Tag
              color={DiffMap[log.pathPair.unmatchedType]?.color}
              style={{ height: 'fit-content' }}
            >
              {DiffMap[log.pathPair.unmatchedType]?.text}
            </Tag>

            {log.pathPair.unmatchedType === 3 ? (
              <Typography.Text type='secondary'>
                {'Value of '} <PathTooltip path={log.path} /> {' is different, excepted '}
                <Typography.Text code ellipsis style={{ maxWidth: '200px' }}>
                  {log.baseValue}
                </Typography.Text>
                {', actual '}
                <Typography.Text code ellipsis style={{ maxWidth: '200px' }}>
                  {log.testValue}
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
                title='Diff Match'
                icon={<DiffOutlined />}
                onClick={() =>
                  modal.info({
                    title: 'Diff Match',
                    content: <DiffMatch text1={log.baseValue} text2={log.testValue} />,
                  })
                }
              />

              <TooltipButton
                size='small'
                type='default'
                breakpoint='xxl'
                title='Ignore Node'
                icon={<StopOutlined />}
                onClick={() => handleIgnoreNode(log.pathPair)}
              />
            </Space>
          </div>
        ))}
      </Space>

      {contextHolder}
    </Card>
  );
};

export default DiffList;
