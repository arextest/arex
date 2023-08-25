import { ArexPaneFC, useTranslation } from '@arextest/arex-core';
import { Divider } from 'antd';
import React from 'react';

import DataDescription from '@/panes/SystemSetting/DataDescription';
import UserInterface from '@/panes/SystemSetting/UserInterface';

const SystemSetting: ArexPaneFC = () => {
  const { t } = useTranslation(['components']);

  return (
    <div>
      <Divider orientation='left'>{t('userSetting.userInterface')} </Divider>
      <UserInterface />

      <Divider orientation='left'> {t('userSetting.dataDescription')}</Divider>
      <DataDescription />
    </div>
  );
};

export default SystemSetting;
