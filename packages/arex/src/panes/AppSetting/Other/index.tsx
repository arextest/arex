import { useTranslation } from '@arextest/arex-core';
import { Space } from 'antd';
import React, { FC } from 'react';

import { SingleCollapse } from '@/components';

import AppBasicSetup from './AppBasicSetup';
import DangerZone from './DangerZone';

export interface SettingOtherProps {
  appId: string;
}

const SettingOther: FC<SettingOtherProps> = (props) => {
  const { t } = useTranslation(['components', 'common']);

  return (
    <Space direction='vertical' size='large' style={{ width: '100%', marginTop: '8px' }}>
      <SingleCollapse
        defaultActive
        item={{
          key: 'owners',
          label: t('appSetting.appBasicSetup'),
          children: <AppBasicSetup appId={props.appId} />,
        }}
      />

      <SingleCollapse
        item={{
          key: 'dangerZone',
          label: t('appSetting.dangerZone'),
          children: <DangerZone appId={props.appId} />,
        }}
      />
    </Space>
  );
};

export default SettingOther;
