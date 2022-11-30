import './style/index.less';

import { LoadingOutlined } from '@ant-design/icons';
import { ConfigProvider, Spin, theme } from 'antd';
import { MappingAlgorithm } from 'antd/es/config-provider/context';
import { AliasToken } from 'antd/lib/theme/interface';
import React, { useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

import { HttpProvider } from './components/arex-request';
import { useAuthentication, useCheckChrome, useInit } from './hooks';
import routerConfig from './router';
import { useStore } from './store';
import useUserProfile from './store/useUserProfile';
import { generateToken } from './style/theme';

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

  const token = useMemo<Partial<AliasToken>>(() => {
    const _token = generateToken(colorPrimary);
    console.log({ token: _token, colorPrimary });
    return _token;
  }, [colorPrimary]);
  const algorithm = useMemo<MappingAlgorithm[]>(() => {
    const _algorithm = [defaultAlgorithm];
    darkMode && _algorithm.push(darkAlgorithm);
    compactMode && _algorithm.push(compactAlgorithm);
    return _algorithm;
  }, [darkMode, compactMode]);

  return (
    <ConfigProvider
      theme={{
        token,
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
    </ConfigProvider>
  );
}

export default App;
