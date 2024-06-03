import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Button, Divider, Typography } from 'antd';
import React, { FC } from 'react';

import { STORAGE_SERVER_URL } from '@/constant';
import { SystemService } from '@/services';

export type AgentScriptProps = {
  appId: string;
};

const AgentScript: FC<AgentScriptProps> = (props) => {
  const { data, loading } = useRequest(SystemService.querySaasSystemConfig, {});
  const { t } = useTranslation();

  return (
    <div>
      <Typography.Text style={{ display: 'block' }}>{t('common:agentScript')}:</Typography.Text>

      <Typography.Text code copyable>
        {`java - javaagent:</path/to/arex-agent.jar> -Darex.service.name=${
          props.appId
        }  -Darex.storage.service.host=${STORAGE_SERVER_URL} -Darex.api.token=${
          loading
            ? '**:******************************************************************************************'
            : data?.['saas_api_tenant_token']
        } -jar <your-application.jar>`}
      </Typography.Text>
      <Divider style={{ margin: '8px 0' }} />
      <Typography.Text strong style={{ marginRight: '8px' }}>
        {t('common:downloadAgent')}
      </Typography.Text>
      <Button icon={<DownloadOutlined />} size='small'>
        {t('common:download')}
      </Button>
    </div>
  );
};

export default AgentScript;
