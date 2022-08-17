import 'antd/dist/antd.less';
import './style/index.less';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import { useRoutes } from 'react-router-dom';

import { useAuth, useCheckChromeExtension } from './hooks';
import routerConfig from './routers';
import { ThemeProvider } from './style/theme';

Spin.setDefaultIndicator(<LoadingOutlined style={{ fontSize: 24 }} spin />);

function App() {
  const routesContent = useRoutes(routerConfig);

  useCheckChromeExtension();
  useAuth();

  return <ThemeProvider>{routesContent}</ThemeProvider>;
}

export default App;
