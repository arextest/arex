import 'antd/dist/antd.less';
import './style/index.less';

import { LoadingOutlined } from '@ant-design/icons';
import { Theme as EmotionTheme, ThemeProvider } from '@emotion/react';
import { Spin } from 'antd';
import { HttpProvider } from 'arex-request';
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
  useAuth();
  useCheckChromeExtension();
  useInterfaceInit(); // init theme, fontSize, etc.

  const {
    userInfo: {
      profile: { theme: themeName, language },
    },
    collectionTreeData,
    themeClassify,
    currentEnvironment,
  } = useStore();
  const theme = useMemo<EmotionTheme>(
    () => (themeName in themeMap ? themeMap[themeName] : themeMap[DefaultConfig.theme]),
    [themeName],
  );

  return (
    <HttpProvider
      theme={themeClassify}
      locale={{ 'zh-CN': 'cn', 'en-US': 'en' }[language]}
      collectionTreeData={collectionTreeData}
      environment={currentEnvironment}
    >
      <ThemeProvider theme={theme}>{routesContent}</ThemeProvider>
    </HttpProvider>
  );
}

export default App;
