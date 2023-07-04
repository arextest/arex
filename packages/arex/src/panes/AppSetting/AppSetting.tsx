import { ArexPaneFC, css, useTranslation } from '@arextest/arex-core';
import { Tabs } from 'antd';
import React, { useMemo } from 'react';

import CompareConfig from '@/panes/AppSetting/CompareConfig';
import { ApplicationDataType } from '@/services/ApplicationService';

import SettingImportYaml from './ImportYaml';
import SettingNodesIgnore from './NodesIgnore';
import SettingNodesSort from './NodesSort';
import SettingOther from './Other';
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
        children: <SettingImportYaml appId={data.appId} />,
      },
      // TODO 暂时隐藏
      {
        key: 'compareConfig',
        label: t('appSetting.compareConfig'),
        children: <CompareConfig appId={data.appId} />,
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
      {
        key: 'other',
        label: t('appSetting.other'),
        children: <SettingOther appId={data.appId} />,
      },
    ],
    [data, t],
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

export default AppSetting;
