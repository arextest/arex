import { DeleteOutlined } from '@ant-design/icons';
import { HelpTooltip, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Badge, Button, Popconfirm, Switch, Table, Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { FC } from 'react';

import { ConfigService } from '@/services';
import { AgentData } from '@/services/ConfigService';

export interface RunningStatusProps {
  appId: string;
}

const AgentStatusMap: {
  [status: string]: {
    code: number;
    badgeStatus: 'default' | 'success' | 'warning' | 'processing' | 'error' | undefined;
  };
} = {
  NONE: {
    code: 0, // NONE
    badgeStatus: 'default',
  },
  START: {
    code: 1, // Arex first load the config
    badgeStatus: 'success',
  },
  UN_START: {
    code: 2, // AREX just to load the config
    badgeStatus: 'warning',
  },
  WORKING: {
    code: 3, // AREX is up and recording
    badgeStatus: 'processing',
  },
  SLEEPING: {
    code: 4, // AREX is up, but not recording maybe rate=0 or allowDayOfWeeks is not match
    badgeStatus: 'error',
  },
  SHUTDOWN: {
    code: 5, // AREX is shutdown, need to restart
    badgeStatus: 'default',
  },
};

const RunningStatus: FC<RunningStatusProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const agentColumns: ColumnsType<AgentData> = [
    {
      title: 'Host',
      dataIndex: 'host',
      align: 'center',
      render: (text) => <Typography.Text copyable>{text}</Typography.Text>,
    },
    {
      title: t('version', { ns: 'common' }),
      dataIndex: 'recordVersion',
      align: 'center',
      render: (text) => <Typography.Text>{text || '-'}</Typography.Text>,
    },
    {
      title: t('modifiedTime', { ns: 'common' }),
      dataIndex: 'modifiedTime',
      align: 'center',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: (
        <HelpTooltip
          title={<div style={{ whiteSpace: 'pre-line' }}>{t('appSetting.agentStatusTip')}</div>}
        >
          {t('agentStatus', { ns: 'common' })}
        </HelpTooltip>
      ),
      dataIndex: 'agentStatus',
      align: 'center',
      render: (status: string) => (
        <Typography.Text>
          <Badge
            status={AgentStatusMap[status]?.badgeStatus || 'default'}
            style={{ marginRight: '8px' }}
          />
          {status || '-'}
        </Typography.Text>
      ),
    },
    {
      title: t('replay.caseTags'),
      dataIndex: 'tags',
      align: 'center',
      render: (_, record) =>
        _
          ? Object.entries(record.tags || {}).map(([key, value], index) => (
              <Tag key={index}>
                {key}:{value}
              </Tag>
            ))
          : '-',
    },
    {
      title: <HelpTooltip title={t('appSetting.debugTooltip')}>{t('replay.debug')}</HelpTooltip>,
      align: 'center',
      render: (_, record) => {
        const debug = record.extendField?.['arex.enable.debug'] === 'true';
        return (
          <Switch
            size='small'
            checked={debug}
            onChange={(value) => {
              updateAgent({
                appId: record.appId,
                host: record.host,
                extendField: {
                  ...record.extendField,
                  'arex.enable.debug': value ? 'true' : 'false',
                },
              });
            }}
          />
        );
      },
    },
    {
      title: t('replay.action', { ns: 'components' }),
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title={t('appSetting.confirmDelete', { ns: 'components' })}
          onConfirm={() => deleteAgent({ appId: record.appId, id: record.id })}
          okText={t('yes', { ns: 'common' })}
          cancelText={t('no', { ns: 'common' })}
        >
          <Button danger type='link' size='small' icon={<DeleteOutlined />}>
            {t('replay.delete', { ns: 'components' })}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const {
    data: agentData,
    loading: loadingAgentList,
    refresh,
    run,
  } = useRequest(ConfigService.getAgentList, {
    defaultParams: [props.appId],
  });

  const { run: updateAgent } = useRequest(ConfigService.updateAgent, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success(t('message.updateSuccess', { ns: 'common' }));
        refresh();
      } else {
        message.error(t('message.updateFailed', { ns: 'common' }));
      }
    },
  });

  const { run: deleteAgent } = useRequest(ConfigService.deleteAgent, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success(t('message.delSuccess', { ns: 'common' }));
        run(props.appId);
      } else {
        message.error(t('message.delFailed', { ns: 'common' }));
      }
    },
  });

  return (
    <Table
      bordered
      size='small'
      pagination={false}
      loading={loadingAgentList}
      dataSource={agentData || []}
      columns={agentColumns}
    />
  );
};

export default RunningStatus;
