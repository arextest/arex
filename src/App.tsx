import 'antd/dist/antd.less';
import './style/index.less';
import './components/app/index.less';

import { ThemeProvider } from '@emotion/react';
import React, { useEffect, useMemo } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';

import CheckChromeExtension from './components/CheckChromeExtension';
import routerConfig from './routers';
import { useStore } from './store';
import { themeCreator } from './style/theme';

function App() {
  const routesContent = useRoutes(routerConfig);
  const { theme: themeName, changeTheme, userInfo } = useStore();
  const theme = useMemo(() => themeCreator(themeName), [themeName]);

  // checkout if the user is logged in
  const nav = useNavigate();
  useEffect(() => {
    console.log(userInfo);
    !userInfo?.email && nav('/login');
  }, [userInfo?.email]);

  // init theme
  useEffect(() => {
    changeTheme(themeName);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CheckChromeExtension />
      {routesContent}
    </ThemeProvider>
  );
}

export default App;
