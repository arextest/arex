import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { ArexMenuFC } from '@arextest/arex-core';
import {
  getLocalStorage,
  SpaceBetweenWrapper,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import styled from '@emotion/styled';
import { useRequest, useToggle } from 'ahooks';
import { theme } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';

import { EMAIL_KEY } from '@/constant';
import { ApplicationService, UserService } from '@/services';
import { ApplicationDataType } from '@/services/ApplicationService';

import MenuSelect from './MenuSelect';

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

const AppMenu: ArexMenuFC = (props) => {
  const { t } = useTranslation(['components']);

  const { token } = theme.useToken();
  const email = getLocalStorage<string>(EMAIL_KEY) as string;

  const [favoriteFilter, { toggle: toggleFavoriteFilter, setRight: disableFavoriteFilter }] =
    useToggle(false);
  const [favoriteAppsInitialized, setFavoriteAppsInitialized] = useState(false);
  const selectedKeys = useMemo(() => (props.value ? [props.value] : []), [props.value]);

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

  return (
    <MenuSelect<ApplicationDataType>
      small
      refresh
      forceFilter
      rowKey='id'
      limit={25}
      initValue={props.value}
      selectedKeys={selectedKeys}
      prefix={
        <TooltipButton
          title={t('applicationsMenu.filterFavoriteApps')}
          icon={
            favoriteFilter ? <HeartFilled style={{ color: token.colorError }} /> : <HeartOutlined />
          }
          onClick={toggleFavoriteFilter}
        />
      }
      onSelect={props.onSelect}
      placeholder={t('applicationsMenu.appFilterPlaceholder') as string}
      request={ApplicationService.getAppList}
      requestOptions={{
        onSuccess(res) {
          !loadingFavoriteApp && recycleDiscard(res);
        },
      }}
      filter={filter}
      itemRender={(app) => ({
        label: (
          <MenuItem app={app} favoriteApps={favoriteApps} onFavoriteAppsChange={getFavoriteApps} />
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

export default AppMenu;
