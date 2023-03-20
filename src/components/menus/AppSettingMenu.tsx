import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

import { useCustomNavigate } from '../../router/useCustomNavigate';
import { ApplicationDataType } from '../../services/Replay.type';
import { PagesType } from '../panes';
import AppMenu from './AppMenu';

const AppSettingMenu: FC = () => {
  const params = useParams();
  const customNavigate = useCustomNavigate();
  const handleAppSettingMenuClick = (app: ApplicationDataType) => {
    customNavigate(
      `/${params.workspaceId}/${PagesType.AppSetting}/${app.id}?data=${encodeURIComponent(
        JSON.stringify(app),
      )}`,
    );
  };

  return <AppMenu onSelect={handleAppSettingMenuClick} />;
};

export default AppSettingMenu;
