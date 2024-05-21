import { CodeOutlined, SettingOutlined, SyncOutlined } from '@ant-design/icons';
import { styled, TooltipButton, useTranslation } from '@arextest/arex-core';
import { Badge, Button, Popover, Skeleton, Typography } from 'antd';
import React, { createElement, ReactNode } from 'react';

import AgentScript from '@/panes/Replay/ReplayReport/AgentScript';

import CompareNoise from './CompareNoise';

const AppTitle = styled(
  (props: {
    appId: string;
    planId?: string;
    className?: string;
    title: ReactNode;
    count?: number;
    readOnly?: boolean;
    onClickTitle?: () => void;
    onRefresh?: () => void;
    onSetting?: () => void;
  }) => {
    const { t } = useTranslation(['components']);

    return (
      <div
        id='arex-replay-record-detail-btn'
        className={props.className}
        style={{ paddingLeft: '4px' }}
      >
        {props.title ? (
          <>
            {createElement(
              props.count ? Button : 'div',
              props.count
                ? { type: 'text', onClick: props.onClickTitle }
                : { style: { padding: '6px 12px 0' } },
              <Badge size='small' count={props.count} offset={[8, 2]}>
                <Typography.Title level={4}>{props.title}</Typography.Title>
              </Badge>,
            )}
            {props.onRefresh && (
              <TooltipButton
                id='arex-replay-refresh-report-btn'
                size='small'
                type='text'
                title={t('replay.refresh')}
                icon={<SyncOutlined />}
                onClick={props.onRefresh}
              />
            )}

            <Popover
              trigger={['click']}
              overlayStyle={{ width: '320px' }}
              overlayInnerStyle={{ padding: '8px' }}
              title={<AgentScript appId={props.appId} />}
            >
              <Button size='small' type='text' icon={<CodeOutlined />} />
            </Popover>

            <CompareNoise appId={props.appId} readOnly={props.readOnly} />

            {props.onSetting && (
              <TooltipButton
                id='arex-replay-app-setting-btn'
                size='small'
                type='text'
                title={t('replay.appSetting')}
                icon={<SettingOutlined />}
                onClick={props.onSetting}
              />
            )}
          </>
        ) : (
          <Skeleton.Input active size='small' style={{ width: '200px' }} />
        )}
      </div>
    );
  },
)`
  display: flex;
  align-items: center;
  & > :first-of-type {
    margin-right: 4px;
  }
`;

export default AppTitle;
