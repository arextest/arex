import 'antd/dist/antd.less';
import './style/index.less';

import { LoadingOutlined } from '@ant-design/icons';
import { Theme as EmotionTheme, ThemeProvider } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

import { FontSizeMap } from './constant';
import { useAuth, useCheckChromeExtension } from './hooks';
import routerConfig from './routers';
import { UserService } from './services/UserService';
import { useStore } from './store';
import { ThemeKey, themeMap } from './style/theme';
import { getLocalStorage } from './utils';

Spin.setDefaultIndicator(<LoadingOutlined style={{ fontSize: 24 }} spin />);

function App() {
  const routesContent = useRoutes(routerConfig);

  useCheckChromeExtension();
  useAuth();

  const {
    changeTheme,
    userInfo: {
      email,
      profile: { theme: themeName, fontSize },
    },
    setUserInfo,
  } = useStore();
  const theme = useMemo<EmotionTheme>(() => themeMap[themeName], [themeName]);

  useRequest(() => UserService.userProfile(email as string), {
    ready: !!email,
    onSuccess(res) {
      setUserInfo(res);
      const themeName = res.profile.theme;
      const themeLS = getLocalStorage(ThemeKey);
      // 如果localStorage中的theme与当前的theme不一致，则更新localStorage中的theme
      // TODO
      // themeName in Theme &&
      themeLS !== themeName && changeTheme(themeName);
    },
  });

  useEffect(() => {
    changeTheme(themeName);
    console.log('fontSize', fontSize);
    // @ts-ignore
    document.body.style['zoom'] = FontSizeMap[fontSize]; // Non-standard: https://developer.mozilla.org/en-US/docs/Web/CSS/zoom
  }, []);

  return <ThemeProvider theme={theme}>{routesContent}</ThemeProvider>;
}

export default App;
