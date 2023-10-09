import { useTranslation } from '@arextest/arex-core';
import { Space } from 'antd';
import React, { FC } from 'react';

import { SingleCollapse } from '@/components';

import AppOwners from './AppOwners';
import DangerZone from './DangerZone';

export interface SettingOtherProps {
  appId: string;
}

const SettingOther: FC<SettingOtherProps> = (props) => {
  const { t } = useTranslation(['components', 'common']);

  return (
    <Space direction='vertical' size='large' style={{ width: '100%', marginTop: '8px' }}>
      <SingleCollapse
        item={{
          key: 'owners',
          label: t('appSetting.owners'),
          children: <AppOwners appId={props.appId} />,
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
