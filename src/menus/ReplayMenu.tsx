import { FC, useMemo } from 'react';

import MenuSelect from '../components/MenuSelect';
import { generateGlobalPaneId, parseGlobalPaneId } from '../helpers/utils';
import { PagesType } from '../pages';
import ReplayService from '../services/Replay.service';
import { ApplicationDataType } from '../services/Replay.type';
import { useStore } from '../store';
import { MenusType } from './index';

const ReplayMenu: FC = () => {
  const { activeMenu, setPages } = useStore();
  const value = useMemo(() => parseGlobalPaneId(activeMenu[1])['rawId'], [activeMenu]);
  const selectedKeys = useMemo(() => (value ? [value] : []), [value]);

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

  return (
    <MenuSelect<ApplicationDataType>
      small
      refresh
      rowKey='id'
      initValue={value}
      selectedKeys={selectedKeys}
      onSelect={handleReplayMenuClick}
      placeholder='applicationsMenu.appFilterPlaceholder'
      request={ReplayService.regressionList}
      filter={(keyword, app) => app.appName.includes(keyword) || app.appId.includes(keyword)}
      itemRender={(app) => ({
        label: app.appId,
        key: app.id,
      })}
      sx={{
        padding: '8px 0 8px 8px',
      }}
    />
  );
};

export default ReplayMenu;
