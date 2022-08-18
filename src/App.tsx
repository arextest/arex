import 'antd/dist/antd.less';
import './style/index.less';

import { LoadingOutlined } from '@ant-design/icons';
import { Theme as EmotionTheme, ThemeProvider } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

import { useAuth, useCheckChromeExtension } from './hooks';
import routerConfig from './routers';
import { UserService } from './services/UserService';
import { useStore } from './store';
import { Theme, ThemeKey, themeMap } from './style/theme';

Spin.setDefaultIndicator(<LoadingOutlined style={{ fontSize: 24 }} spin />);

function App() {
  const routesContent = useRoutes(routerConfig);

  useCheckChromeExtension();
  useAuth();

  const {
    changeTheme,
    userInfo: {
      email,
      profile: { theme: themeName },
    },
  } = useStore();
  const theme = useMemo<EmotionTheme>(() => themeMap[themeName], [themeName]);

  useRequest(() => UserService.userProfile(email as string), {
    ready: !!email,
    onSuccess(res) {
      const themeName = res.profile.theme;
      const themeLS = localStorage.getItem(ThemeKey);
      // 如果localStorage中的theme与当前的theme不一致，则更新localStorage中的theme
      // TODO
      // themeName in Theme &&
      themeLS !== themeName && changeTheme(themeName);
    },
  });

  useEffect(() => {
    changeTheme(themeName);
  }, []);

  return <ThemeProvider theme={theme}>{routesContent}</ThemeProvider>;
}

export default App;
