import {
  ArexPaneFC,
  clearLocalStorage,
  css,
  setLocalStorage,
  useTranslation,
} from '@arextest/arex-core';
import { Tabs } from 'antd';
import React, { useEffect, useMemo } from 'react';

import { APP_ID_KEY } from '@/constant';
import CompareConfig from '@/panes/AppSetting/CompareConfig';
import { ApplicationDataType } from '@/services/ApplicationService';
import { useMenusPanes } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import SettingImportYaml from './ImportYaml';
import SettingOther from './Other';
import SettingRecord from './Record';
import SettingReplay from './Replay';

const AppSetting: ArexPaneFC<ApplicationDataType> = (props) => {
  const { paneKey } = props;
  const { activePane } = useMenusPanes();
  const { id: appId } = useMemo(() => decodePaneKey(paneKey), [paneKey]);
  const { t } = useTranslation(['components']);

  const TabsItems = useMemo(
    () => [
      {
        key: 'record',
        label: t('appSetting.record'),
        children: <SettingRecord appId={appId} />,
      },
      {
        key: 'replay',
        label: t('appSetting.replay'),
        children: <SettingReplay appId={appId} />,
      },
      {
        key: 'compareConfig',
        label: t('appSetting.compareConfig'),
        children: <CompareConfig appId={appId} />,
      },
      {
        key: 'importYaml',
        label: t('appSetting.importYaml'),
        children: <SettingImportYaml appId={appId} />,
      },
      {
        key: 'other',
        label: t('appSetting.other'),
        children: <SettingOther appId={appId} />,
      },
    ],
    [appId, t],
  );

  useEffect(() => {
    activePane?.key === props.paneKey && setLocalStorage(APP_ID_KEY, appId);
    return () => clearLocalStorage(APP_ID_KEY);
  }, [activePane?.id]);

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
