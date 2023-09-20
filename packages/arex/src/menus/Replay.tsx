import { HeartFilled, HeartOutlined, HistoryOutlined } from '@ant-design/icons';
import {
  ArexMenuFC,
  createArexMenu,
  getLocalStorage,
  SpaceBetweenWrapper,
  styled,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest, useSize, useToggle } from 'ahooks';
import { theme } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';

import { MenuSelect, MenuSelectProps } from '@/components';
import { EMAIL_KEY, MenusType, PanesType } from '@/constant';
import { ApplicationService, UserService } from '@/services';
import { ApplicationDataType } from '@/services/ApplicationService';
import { useApplication, useMenusPanes } from '@/store';

type MenuItemProps = {
  app: ApplicationDataType;
  favoriteApps?: string[];
  onFavoriteAppsChange?: () => void;
};
const MenuItem = styled((props: MenuItemProps) => {
  const { app, favoriteApps = [], onFavoriteAppsChange, ...restProps } = props;
  const { token } = theme.useToken();
  const email = getLocalStorage<string>(EMAIL_KEY) as string;

  const { run: favoriteApp } = useRequest(
    () => UserService.setFavoriteApp({ userName: email, favoriteApp: app.id }),
    {
      manual: true,
      onSuccess(res) {
        res && onFavoriteAppsChange?.();
      },
    },
  );

  const { run: unFavoriteApp } = useRequest(
    () => UserService.setUnFavoriteApp({ userName: email, favoriteApp: app.id }),
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
          <HeartFilled onClick={unFavoriteApp} style={{ color: token.colorError }} />
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
      opacity: 0;
      transition: opacity ease 0.3s;
    }
  }

  &:hover {
    .menu-item-heart-outlined {
      opacity: 1;
    }
  }
`;

const ReplayMenu: ArexMenuFC = (props) => {
  const { t } = useTranslation(['components']);
  const { activePane } = useMenusPanes();
  const size = useSize(() => document.getElementById('arex-menu-wrapper'));

  const height = useMemo(() => size && size?.height - 88, [size]);

  const { token } = theme.useToken();
  const email = getLocalStorage<string>(EMAIL_KEY) as string;
  const { timestamp } = useApplication();

  const [favoriteFilter, { toggle: toggleFavoriteFilter, setRight: disableFavoriteFilter }] =
    useToggle(false);
  const [favoriteAppsInitialized, setFavoriteAppsInitialized] = useState(false);
  const selectedKeys = useMemo(
    () => (activePane?.type === PanesType.REPLAY && props.value ? [props.value] : []),
    [activePane?.type, props.value],
  );

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

  const filter = useCallback(
    (keyword: string, app: ApplicationDataType) => {
      return keyword
        ? app.appName.includes(keyword) || app.appId.includes(keyword)
        : favoriteFilter
        ? !!favoriteApps?.includes(app.id)
        : true;
    },
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
        discard.map((id) => UserService.setUnFavoriteApp({ userName: email, favoriteApp: id })),
      ).then((res) => res.length && getFavoriteApps());
    }
  };

  const handleSelect: MenuSelectProps<ApplicationDataType, any[]>['onSelect'] = (value) => {
    props.onSelect?.(value); // to streamline the params, remove the types from onSelect handler
  };

  return (
    <div style={{ padding: '8px' }}>
      <MenuSelect<ApplicationDataType>
        small
        refresh
        forceFilter
        rowKey='appId'
        limit={25}
        initValue={props.value}
        selectedKeys={selectedKeys}
        prefix={
          <TooltipButton
            title={t('applicationsMenu.filterFavoriteApps')}
            icon={
              favoriteFilter ? (
                <HeartFilled style={{ color: token.colorError }} />
              ) : (
                <HeartOutlined />
              )
            }
            onClick={toggleFavoriteFilter}
          />
        }
        onSelect={handleSelect}
        placeholder={t('applicationsMenu.appFilterPlaceholder') as string}
        request={ApplicationService.getAppList}
        requestOptions={{
          refreshDeps: [timestamp], // refresh when delete app
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
              onFavoriteAppsChange={getFavoriteApps}
            />
          ),
          key: app.appId,
        })}
        height={height}
        sx={{
          padding: '8px 0',
          '.ant-menu-item': {
            paddingInlineEnd: 0, // 防止在 padding 范围内导致 :hover 失效
          },
        }}
      />
    </div>
  );
};

export default createArexMenu(ReplayMenu, {
  type: MenusType.REPLAY,
  paneType: PanesType.REPLAY,
  icon: <HistoryOutlined />,
});
