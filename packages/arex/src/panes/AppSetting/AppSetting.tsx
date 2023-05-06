import { Tabs } from 'antd';
import { ArexPaneFC, css, useTranslation } from 'arex-core';
import React, { useMemo } from 'react';

import { ApplicationDataType } from '@/services/ApplicationService';

import SettingImportYaml from './ImportYaml';
import SettingNodesIgnore from './NodesIgnore';
import SettingNodesSort from './NodesSort';
import SettingRecord from './Record';
import SettingReplay from './Replay';

const AppSetting: ArexPaneFC<ApplicationDataType> = (props) => {
  const { data } = props;
  const { t } = useTranslation(['components']);

  const TabsItems = useMemo(
    () => [
      {
        key: 'record',
        label: t('appSetting.record'),
        children: <SettingRecord appId={data.appId} />,
      },
      {
        key: 'replay',
        label: t('appSetting.replay'),
        children: <SettingReplay appId={data.appId} />,
      },
      {
        key: 'importYaml',
        label: t('appSetting.importYaml'),
        children: <SettingImportYaml appId={data.appId} agentVersion={data.agentVersion} />,
      },
      {
        key: 'nodesIgnore',
        label: t('appSetting.nodesIgnore'),
        children: <SettingNodesIgnore appId={data.appId} />,
      },
      {
        key: 'nodesSort',
        label: t('appSetting.nodesSort'),
        children: <SettingNodesSort appId={data.appId} />,
      },
    ],
    [data],
  );

  return (
    <Tabs
      size='small'
      tabPosition='left'
      items={TabsItems}
      css={css`
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

export default AppSetting;
