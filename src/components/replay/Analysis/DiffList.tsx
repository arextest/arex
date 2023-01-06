import { StopOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, Button, Card, Space, Tag, Typography } from 'antd';
import React, { FC } from 'react';

import AppSettingService from '../../../services/AppSetting.service';
import ReplayService from '../../../services/Replay.service';
import { QueryMsgWithDiffLog, QueryMsgWithDiffRes, Scene } from '../../../services/Replay.type';
import { TooltipButton } from '../../index';

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

export type DiffListType = {
  appId: string;
  operationId: string;
  scene?: Scene;
  onTreeModeClick?: (diff?: QueryMsgWithDiffRes) => void;
};

const DiffList: FC<DiffListType> = (props) => {
  const { message } = App.useApp();

  const { data: diffData, loading } = useRequest(
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
            <Tag color={DiffMap[log.pathPair.unmatchedType]?.color}>
              {DiffMap[log.pathPair.unmatchedType]?.text}
            </Tag>

            {log.pathPair.unmatchedType === 3 ? (
              <Typography.Text type='secondary'>
                {'Value of '}
                <Typography.Text code ellipsis style={{ maxWidth: '200px' }}>
                  {log.path || '[]'}
                </Typography.Text>
                {' is different, excepted '}
                <Typography.Text code ellipsis style={{ maxWidth: '200px' }}>
                  {log.baseValue || '[]'}
                </Typography.Text>
                {', actual '}
                <Typography.Text code ellipsis style={{ maxWidth: '200px' }}>
                  {log.testValue || '[]'}
                </Typography.Text>
                {'.'}
              </Typography.Text>
            ) : (
              <Typography.Text type='secondary'>
                <Typography.Text code>{log.path}</Typography.Text>
                {DiffMap[log.pathPair.unmatchedType].desc}
              </Typography.Text>
            )}

            <TooltipButton
              size='small'
              type='default'
              breakpoint='xxl'
              title='Ignore Node'
              icon={<StopOutlined />}
              onClick={() => handleIgnoreNode(log.pathPair)}
              style={{ float: 'right', marginLeft: 'auto' }}
            />
          </div>
        ))}
      </Space>
    </Card>
  );
};

export default DiffList;
