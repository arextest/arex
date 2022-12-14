import { FC } from 'react';
import AppMenu from './AppMenu';
import { useStore } from '../store';
import { ApplicationDataType } from '../services/Replay.type';
import { MenusType } from './index';
import { PagesType } from '../pages';
import { generateGlobalPaneId } from '../helpers/utils';

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
