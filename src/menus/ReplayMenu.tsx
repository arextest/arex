import React, { FC } from 'react';

import { generateGlobalPaneId } from '../helpers/utils';
import { PagesType } from '../pages';
import { ApplicationDataType } from '../services/Replay.type';
import { useStore } from '../store';
import AppMenu from './AppMenu';
import { MenusType } from './index';

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
