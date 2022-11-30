import { LoadingOutlined } from '@ant-design/icons';
import { Spin, theme } from 'antd';
import { MappingAlgorithm } from 'antd/es/config-provider/context';
import React, { useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

import { HttpProvider } from './components/arex-request';
import { useAuthentication, useCheckChrome, useInit } from './hooks';
import routerConfig from './router';
import { useStore } from './store';
import useUserProfile from './store/useUserProfile';
import { generateToken, GlobalThemeProvider } from './theme';

const { darkAlgorithm, compactAlgorithm, defaultAlgorithm } = theme;

// global Spin config
Spin.setDefaultIndicator(<LoadingOutlined spin style={{ fontSize: 24 }} />);

function App() {
  useCheckChrome();
  useAuthentication();
  useInit();

  const routesContent = useRoutes(routerConfig);

  const { collectionTreeData, currentEnvironment } = useStore();
  const { language, theme, darkMode, compactMode, colorPrimary } = useUserProfile();

  const algorithm = useMemo<MappingAlgorithm[]>(() => {
    const _algorithm = [defaultAlgorithm];
    darkMode && _algorithm.push(darkAlgorithm);
    compactMode && _algorithm.push(compactAlgorithm);
    return _algorithm;
  }, [darkMode, compactMode]);

  return (
    <GlobalThemeProvider
      theme={{
        token: generateToken(theme, colorPrimary),
        algorithm,
      }}
    >
      <HttpProvider
        theme={theme}
        locale={{ 'zh-CN': 'cn', 'en-US': 'en' }[language]}
        collectionTreeData={collectionTreeData}
        environment={currentEnvironment}
      >
        {routesContent}
      </HttpProvider>
    </GlobalThemeProvider>
  );
}

export default App;
