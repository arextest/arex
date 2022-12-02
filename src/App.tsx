import { LoadingOutlined } from '@ant-design/icons';
import { Layout, Spin, theme } from 'antd';
import { MappingAlgorithm } from 'antd/es/config-provider/context';
import React, { useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

import { useAuthentication, useCheckChrome, useInit } from './hooks';
import { localeMap } from './i18n';
import routerConfig from './router';
import useUserProfile from './store/useUserProfile';
import { generateToken, GlobalConfigProvider } from './theme';

const { Content } = Layout;
const { darkAlgorithm, compactAlgorithm, defaultAlgorithm } = theme;

// global Spin config
Spin.setDefaultIndicator(<LoadingOutlined spin style={{ fontSize: 24 }} />);

function App() {
  useCheckChrome();
  useAuthentication();
  useInit();

  const routesContent = useRoutes(routerConfig);

  const { theme, darkMode, compactMode, colorPrimary, language } = useUserProfile();

  const algorithm = useMemo<MappingAlgorithm[]>(() => {
    const _algorithm = [defaultAlgorithm];
    darkMode && _algorithm.push(darkAlgorithm);
    compactMode && _algorithm.push(compactAlgorithm);
    return _algorithm;
  }, [darkMode, compactMode]);

  return (
    <GlobalConfigProvider
      theme={{
        token: generateToken(theme, colorPrimary),
        algorithm,
      }}
      locale={localeMap[language]}
    >
      <Layout>
        <Content>{routesContent}</Content>
      </Layout>
    </GlobalConfigProvider>
  );
}

export default App;
