import 'antd/dist/antd.less';
import './style/index.less';

import { LoadingOutlined } from '@ant-design/icons';
import { Theme as EmotionTheme, ThemeProvider } from '@emotion/react';
import { Spin } from 'antd';
import React, { useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

import DefaultConfig from './defaultConfig';
import { useAuth, useCheckChromeExtension, useInterfaceInit } from './hooks';
import routerConfig from './routers';
import { useStore } from './store';
import { themeMap } from './style/theme';

// global Spin config
Spin.setDefaultIndicator(<LoadingOutlined style={{ fontSize: 24 }} spin />);

function App() {
  const routesContent = useRoutes(routerConfig);

  useCheckChromeExtension();
  useAuth();
  useInterfaceInit(); // init theme, fontSize, etc.

  const {
    userInfo: {
      profile: { theme: themeName },
    },
  } = useStore();
  const theme = useMemo<EmotionTheme>(
    () => (themeName in themeMap ? themeMap[themeName] : themeMap[DefaultConfig.theme]),
    [themeName],
  );

  return <ThemeProvider theme={theme}>{routesContent}</ThemeProvider>;
}

export default App;
