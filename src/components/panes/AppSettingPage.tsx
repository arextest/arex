import { css } from '@emotion/react';
import { Tabs } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ApplicationDataType } from '../../services/Replay.type';
import {
  SettingImportYaml,
  SettingNodesIgnore,
  SettingNodesSort,
  SettingRecord,
  SettingReplay,
} from '../appSetting';
import { PageFC } from './index';

const AppSettingPage: PageFC<ApplicationDataType> = (props) => {
  const { t } = useTranslation(['components']);

  const data: any = props.page.data;
  const TabsItems = useMemo(
    () => [
      {
        key: 'record',
        label: t('appSetting.record'),
        children: <SettingRecord appId={data.appId} agentVersion={data.agentVersion} />,
      },
      {
        key: 'replay',
        label: t('appSetting.replay'),
        children: <SettingReplay appId={data.appId} agentVersion={data.agentVersion} />,
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

export default AppSettingPage;
