import { LoadingOutlined } from '@ant-design/icons';
import { Layout, Spin, theme } from 'antd';
import { MappingAlgorithm } from 'antd/es/config-provider/context';
import React, { useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

import { useAuthentication, useCheckChrome, useInit } from './hooks';
import routerConfig from './router';
import { useStore } from './store';
import useUserProfile from './store/useUserProfile';
import { generateToken, GlobalThemeProvider } from './theme';

const { Content } = Layout;
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
      <Layout style={{ height: '100vh' }}>
        <Content>{routesContent}</Content>
      </Layout>
    </GlobalThemeProvider>
  );
}

export default App;
