import { useRequest } from 'ahooks';
import { Table, Typography,Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslation, HelpTooltip } from 'arex-core';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { stringTransformDom } from '../utils';

import { ConfigService } from '@/services';
import { AgentData } from '@/services/ConfigService';

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
      title: <HelpTooltip title={<div dangerouslySetInnerHTML={stringTransformDom(t('appSetting.agentStatusTip'))}></div>}>{t('agentStatus', { ns: 'common' })}</HelpTooltip>,
      dataIndex: 'agentStatus',
      align: 'center',
      render: (text) => <Typography.Text>{text || '-'}</Typography.Text>,
    }
  ];

  const { data: agentData, loading: loadingAgentList } = useRequest(ConfigService.getAgentList, {
    defaultParams: [props.appId],
  });
  
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
