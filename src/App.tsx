import { LoadingOutlined } from '@ant-design/icons';
import { App as AppWrapper, Empty, Layout, Spin, theme } from 'antd';
import { MappingAlgorithm } from 'antd/es/config-provider/context';
import React, { useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

import { useAuthentication } from './hooks';
import { localeMap } from './i18n';
import routerConfig from './router';
import useUserProfile from './store/useUserProfile';
import { generateToken, GlobalConfigProvider } from './theme';
import GlobalStyle from './theme/GlobalStyle';

const { Content } = Layout;
const { darkAlgorithm, compactAlgorithm, defaultAlgorithm } = theme;

// global Spin config
Spin.setDefaultIndicator(<LoadingOutlined spin style={{ fontSize: 24 }} />);

function App() {
  useAuthentication();

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
      renderEmpty={() => Empty.PRESENTED_IMAGE_SIMPLE}
    >
      <GlobalStyle>
        <AppWrapper>
          <Layout>
            <Content>{routesContent}</Content>
          </Layout>
        </AppWrapper>
      </GlobalStyle>
    </GlobalConfigProvider>
  );
}

export default App;
