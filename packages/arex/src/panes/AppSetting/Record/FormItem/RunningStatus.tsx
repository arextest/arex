import { HelpTooltip, useTranslation } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Popconfirm, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { FC } from 'react';

import { ConfigService } from '@/services';
import { AgentData } from '@/services/ConfigService';
import { deleteAgent } from '@/services/ConfigService/deleteAgent';

export interface RunningStatusProps {
  appId: string;
}

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
      render: (text) => <Typography.Text>{text || '-'}</Typography.Text>,
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
          okText='Yes'
          cancelText='No'
        >
          <a
            css={css`
              color: red;
              &:hover {
                color: red;
              }
            `}
          >
            {t('replay.delete', { ns: 'components' })}
          </a>
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
