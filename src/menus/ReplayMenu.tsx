import { FC } from 'react';
import AppMenu from './AppMenu';
import { ApplicationDataType } from '../services/Replay.type';
import { MenusType } from './index';
import { PagesType } from '../pages';
import { generateGlobalPaneId } from '../helpers/utils';
import { useStore } from '../store';

const ReplayMenu: FC = () => {
  const { setPages } = useStore();

  const handleReplayMenuClick = (app: ApplicationDataType) => {
    setPages(
      {
        title: app.appId,
        menuType: MenusType.Replay,
        pageType: PagesType.Replay,
        isNew: false,
        data: app,
        paneId: generateGlobalPaneId(MenusType.Collection, PagesType.Replay, app.id),
        rawId: app.id,
      },
      'push',
    );
  };

  return <AppMenu onSelect={handleReplayMenuClick} />;
};

export default ReplayMenu;
