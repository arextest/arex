import { ArexPaneFC, Label, useTranslation } from '@arextest/arex-core';
import { Divider, Typography } from 'antd';
import React from 'react';

import CallbackUrl from '@/panes/SystemSetting/CallbackUrl';

import Application from './Application';
import DataDesensitization from './DataDesensitization';
import UserInterface from './UserInterface';

const SystemSetting: ArexPaneFC = () => {
  const { t } = useTranslation(['components']);

  return (
    <div>
      <Divider orientation='left'>{t('systemSetting.userInterface')} </Divider>
      <UserInterface />

      <Divider orientation='left'> {t('systemSetting.dataDesensitization')}</Divider>
      <DataDesensitization />

      <Divider orientation='left'> {t('systemSetting.replayCallback')}</Divider>
      <CallbackUrl />

      <Divider orientation='left'> {t('systemSetting.application')}</Divider>
      <Application />
    </div>
  );
};

export default SystemSetting;
