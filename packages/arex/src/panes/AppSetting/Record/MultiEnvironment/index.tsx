import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { Button } from 'antd';
import React, { FC, useState } from 'react';

import EnvironmentRecordSetting from '@/panes/AppSetting/Record/MultiEnvironment/EnvironmentRecordSetting';
import { ApplicationService, ConfigService } from '@/services';
import { MultiEnvironmentConfig } from '@/services/ConfigService';

interface MultiEnvironmentProps {
  appId: string;
}

const MultiEnvironment: FC<MultiEnvironmentProps> = (props) => {
  const [settingWrapper] = useAutoAnimate();
  const { t } = useTranslation(['common']);

  const { data: appInfo, refresh: getAppInfo } = useRequest(ApplicationService.getAppInfo, {
    defaultParams: [props.appId],
  });

  useRequest(ConfigService.queryRecordSetting, {
    defaultParams: [{ appId: props.appId }],
    onSuccess: (data) => {
      setData(data?.multiEnvConfigs ?? []);
    },
  });

  const { run: submit } = useRequest(ConfigService.updateMultiEnvCollectSetting, { manual: true });

  const [data, setData] = useState<MultiEnvironmentConfig[]>([]);
  return (
    <>
      <div ref={settingWrapper}>
        {data.map((item, index) => (
          <EnvironmentRecordSetting
            key={index}
            tagOptions={appInfo?.tags}
            config={item}
            onChange={(newConfig) => {
              setData((data) => {
                // console.log(newConfig)
                const newData = [...data];
                newData[index] = newConfig;
                return newData;
              });
            }}
          />
        ))}
      </div>
      <Button
        block
        type='dashed'
        icon={<PlusOutlined />}
        onClick={() => {
          // todo set default value
          setData([...data, {} as MultiEnvironmentConfig]);
        }}
        style={{ height: 'auto', padding: '16px', marginTop: '8px' }}
      >
        <span style={{ padding: '0 8px' }}>添加环境配置</span>
      </Button>
      <div style={{ float: 'right', margin: '16px 0' }}>
        <Button
          type='primary'
          htmlType='submit'
          onClick={() => submit({ appId: props.appId, multiEnvConfigs: data })}
        >
          {t('save', { ns: 'common' })}
        </Button>
      </div>
    </>
  );
};

export default MultiEnvironment;
