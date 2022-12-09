import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest, useToggle } from 'ahooks';
import { theme } from 'antd';
import React, { FC, useCallback, useMemo, useState } from 'react';

import { TooltipButton } from '../components';
import MenuSelect from '../components/MenuSelect';
import { SpaceBetweenWrapper } from '../components/styledComponents';
import { EmailKey } from '../constant';
import { generateGlobalPaneId, getLocalStorage, parseGlobalPaneId } from '../helpers/utils';
import { PagesType } from '../pages';
import ReplayService from '../services/Replay.service';
import { ApplicationDataType } from '../services/Replay.type';
import { UserService } from '../services/User.service';
import { useStore } from '../store';
import { MenusType } from './index';

type MenuItemProps = {
  app: ApplicationDataType;
  hiddenFavoriteIcon?: boolean;
  favoriteApps?: string[];
  onFavoriteAppsChange?: () => void;
};
const MenuItem = styled((props: MenuItemProps) => {
  const { app, favoriteApps = [], hiddenFavoriteIcon, onFavoriteAppsChange, ...restProps } = props;
  const { token } = theme.useToken();
  const email = getLocalStorage<string>(EmailKey) as string;

  const { run: favoriteApp } = useRequest(
    () => UserService.favoriteApp({ userName: email, favoriteApp: app.id }),
    {
      manual: true,
      onSuccess(res) {
        res && onFavoriteAppsChange?.();
      },
    },
  );

  const { run: unFavoriteApp } = useRequest(
    () => UserService.unFavoriteApp({ userName: email, favoriteApp: app.id }),
    {
      manual: true,
      onSuccess(res) {
        res && onFavoriteAppsChange?.();
      },
    },
  );

  return (
    <SpaceBetweenWrapper {...restProps}>
      <span>{app.appId}</span>
      <span className='menu-item-heart' onClick={(e) => e.stopPropagation()}>
        {favoriteApps.includes(app.id) ? (
          !hiddenFavoriteIcon && (
            <HeartFilled onClick={unFavoriteApp} style={{ color: token.colorError }} />
          )
        ) : (
          <HeartOutlined className='menu-item-heart-outlined' onClick={favoriteApp} />
        )}
      </span>
    </SpaceBetweenWrapper>
  );
})`
  .menu-item-heart {
    padding-right: 8px;
    .menu-item-heart-outlined {
      display: none;
      transition: all 0.3s;
    }
  }

  &:hover {
    .menu-item-heart-outlined {
      display: inherit;
    }
  }
`;

const ReplayMenu: FC = () => {
  const { token } = theme.useToken();
  const { activeMenu, setPages } = useStore();
  const email = getLocalStorage<string>(EmailKey) as string;

  const [favoriteFilter, { toggle: toggleFavoriteFilter, setRight: disableFavoriteFilter }] =
    useToggle(false);
  const [favoriteAppsInitialized, setFavoriteAppsInitialized] = useState(false);

  const value = useMemo(() => parseGlobalPaneId(activeMenu[1])['rawId'], [activeMenu]);
  const selectedKeys = useMemo(() => (value ? [value] : []), [value]);

  const {
    data: favoriteApps,
    loading: loadingFavoriteApp,
    run: getFavoriteApps,
  } = useRequest(() => UserService.getFavoriteApp(email), {
    onSuccess(favoriteApps) {
      if (!favoriteAppsInitialized) {
        favoriteApps.length && disableFavoriteFilter();
        setFavoriteAppsInitialized(true);
      }
    },
  });

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

  const filter = useCallback(
    (keyword: string, app: ApplicationDataType) =>
      favoriteFilter
        ? !!favoriteApps?.includes(app.id) &&
          (app.appName.includes(keyword) || app.appId.includes(keyword))
        : app.appName.includes(keyword) || app.appId.includes(keyword),
    [favoriteFilter, favoriteApps],
  );

  /**
   * 无效的 FavoriteApp 回收策略
   * 1. 当 regressionList 接口响应慢于 getFavoriteApp 接口: 概率触发
   * 2. 当手动刷新 regressionList 接口: 稳定触发
   * @param apps
   */
  const recycleDiscard = (apps: ApplicationDataType[]) => {
    const discard = favoriteApps?.filter((id) => apps.findIndex((app) => app.id === id) < 0);
    if (discard?.length) {
      Promise.all(
        discard.map((id) => UserService.unFavoriteApp({ userName: email, favoriteApp: id })),
      ).then((res) => res.length && getFavoriteApps());
    }
  };

  return (
    <MenuSelect<ApplicationDataType>
      small
      refresh
      forceFilter
      rowKey='id'
      initValue={value}
      selectedKeys={selectedKeys}
      prefix={
        <TooltipButton
          title='Filter Favorite Apps'
          icon={
            favoriteFilter ? <HeartFilled style={{ color: token.colorError }} /> : <HeartOutlined />
          }
          onClick={toggleFavoriteFilter}
        />
      }
      onSelect={handleReplayMenuClick}
      placeholder='applicationsMenu.appFilterPlaceholder'
      request={ReplayService.regressionList}
      requestOptions={{
        onSuccess(res) {
          !loadingFavoriteApp && recycleDiscard(res);
        },
      }}
      filter={filter}
      itemRender={(app) => ({
        label: (
          <MenuItem
            app={app}
            favoriteApps={favoriteApps}
            hiddenFavoriteIcon={favoriteFilter}
            onFavoriteAppsChange={getFavoriteApps}
          />
        ),
        key: app.id,
      })}
      sx={{
        padding: '8px 0',
        '.ant-menu-item': {
          paddingInlineEnd: 0, // 防止在 padding 范围内导致 :hover 失效
        },
      }}
    />
  );
};

export default ReplayMenu;
