import { ArexPaneFC, css, useTranslation } from '@arextest/arex-core';
import { Tabs } from 'antd';
import React, { useMemo } from 'react';

import DataMasking from '@/panes/SystemSetting/DataMasking';
import UserInterface from '@/panes/SystemSetting/UserInterface';

const SystemSetting: ArexPaneFC = () => {
  const { t } = useTranslation(['components']);

  const TabsItems = useMemo(
    () => [
      {
        key: 'record',
        label: t('userSetting.userInterface'),
        children: <UserInterface />,
      },
      {
        key: 'replay',
        label: t('userSetting.dataMasking'),
        children: <DataMasking />,
      },
    ],
    [t],
  );

  return (
    <Tabs
      size='small'
      tabPosition='left'
      items={TabsItems}
      css={css`
        height: 100%;
        .ant-tabs-nav-list > .ant-tabs-tab {
          margin: 4px 0 0 0 !important;
        }
        .ant-tabs-tabpane {
          padding: 0 12px;
        }
      `}
    />
  );
};

export default SystemSetting;
