import { DeploymentUnitOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Modal, Spin, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AppSettingService from '../../../../services/AppSetting.service';
import { AgentData } from '../../../../services/AppSetting.type';
import { TooltipButton } from '../../../index';

export interface AgentHostProps {
  appId: string;
}

const AgentHost: FC<AgentHostProps> = (props) => {
  const { t } = useTranslation(['components', 'common']);
  const [open, setOpen] = useState(false);

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

  const {
    data: agentData,
    run: getAgentList,
    loading: loadingAgentList,
  } = useRequest(AppSettingService.getAgentList, {
    manual: true,
    onBefore() {
      setOpen(true);
    },
  });

  return (
    <>
      <TooltipButton
        title={t('appSetting.agentHost')}
        icon={<DeploymentUnitOutlined />}
        onClick={() => getAgentList(props.appId)}
      />

      <Modal
        destroyOnClose
        open={open}
        footer={false}
        title={t('appSetting.agentHost')}
        onCancel={() => setOpen(false)}
      >
        <Spin spinning={loadingAgentList}>
          <Table
            bordered
            pagination={false}
            size='small'
            dataSource={agentData}
            columns={agentColumns}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default AgentHost;
