import React, { FC } from 'react';

import { generateGlobalPaneId } from '../helpers/utils';
import { PagesType } from '../pages';
import { ApplicationDataType } from '../services/Replay.type';
import { useStore } from '../store';
import AppMenu from './AppMenu';
import { MenusType } from './index';

const AppSettingMenu: FC = () => {
  const { setPages } = useStore();

  const handleAppSettingMenuClick = (app: ApplicationDataType) => {
    setPages(
      {
        title: `Setting ${app.appId}`,
        menuType: MenusType.AppSetting,
        pageType: PagesType.AppSetting,
        isNew: false,
        data: app,
        paneId: generateGlobalPaneId(MenusType.AppSetting, PagesType.AppSetting, app.id),
        rawId: app.id,
      },
      'push',
    );
  };

  return <AppMenu onSelect={handleAppSettingMenuClick} />;
};

export default AppSettingMenu;
