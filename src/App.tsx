import 'antd/dist/antd.less';
import './style/index.less';

import { LoadingOutlined } from '@ant-design/icons';
import { Theme as EmotionTheme, ThemeProvider } from '@emotion/react';
import { Spin } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

import { useAuth, useCheckChromeExtension } from './hooks';
import routerConfig from './routers';
import { useStore } from './store';
import { themeMap } from './style/theme';

Spin.setDefaultIndicator(<LoadingOutlined style={{ fontSize: 24 }} spin />);

function App() {
  const routesContent = useRoutes(routerConfig);

  useCheckChromeExtension();
  useAuth();

  const {
    changeTheme,
    userInfo: {
      profile: { theme: themeName },
    },
  } = useStore();
  const theme = useMemo<EmotionTheme>(() => themeMap[themeName], [themeName]);

  useEffect(() => {
    changeTheme(themeName);
  }, [themeName]);

  return <ThemeProvider theme={theme}>{routesContent}</ThemeProvider>;
}

export default App;
