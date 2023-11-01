import { DeleteOutlined } from '@ant-design/icons';
import { HelpTooltip, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Badge, Button, Popconfirm, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { FC } from 'react';

import { ConfigService } from '@/services';
import { AgentData } from '@/services/ConfigService';
import { deleteAgent } from '@/services/ConfigService/deleteAgent';

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
      title: t('replay.action', { ns: 'components' }),
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title={t('appSetting.confirmDelete', { ns: 'components' })}
          onConfirm={() => {
            confirm(record);
          }}
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
    run,
  } = useRequest(ConfigService.getAgentList, {
    defaultParams: [props.appId],
  });
  const confirm = ({ appId, id }: AgentData) => {
    deleteAgent({ appId, id }).then(() => {
      run(props.appId);
    });
  };
  return (
    <Table
      bordered
      loading={loadingAgentList}
      pagination={false}
      size='small'
      dataSource={agentData}
      columns={agentColumns}
    />
  );
};

export default RunningStatus;
