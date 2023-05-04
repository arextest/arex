import { useRequest } from 'ahooks';
import { Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import AppSettingService from '../../../../services/AppSetting.service';
import { AgentData } from '../../../../services/AppSetting.type';

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
  ];

  const { data: agentData, loading: loadingAgentList } = useRequest(
    AppSettingService.getAgentList,
    {
      defaultParams: [props.appId],
    },
  );

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
