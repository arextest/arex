import 'antd/dist/antd.less';
import './style/index.less';

import { LoadingOutlined } from '@ant-design/icons';
import { Theme as EmotionTheme, ThemeProvider } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

import { FontSizeMap, UserInfoKey } from './constant';
import DefaultConfig from './defaultConfig';
import { useAuth, useCheckChromeExtension } from './hooks';
import routerConfig from './routers';
import { UserService } from './services/UserService';
import { UserInfo, useStore } from './store';
import { themeMap } from './style/theme';
import { getLocalStorage, setLocalStorage } from './utils';

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
  const theme = useMemo<EmotionTheme>(
    () => (themeName in themeMap ? themeMap[themeName] : themeMap[DefaultConfig.theme]),
    [themeName],
  );

  useRequest(() => UserService.userProfile(email as string), {
    ready: !!email,
    onSuccess(res) {
      const themeName = res.profile.theme;
      const themeLS = getLocalStorage<UserInfo>(UserInfoKey)?.profile?.theme;
      // 如果profile中的theme合法且与localStorage中的theme不一致，则更新localStorage中的theme
      if ((themeName || '') in themeMap && (themeLS || '') in themeMap) {
        if (themeName !== themeLS) {
          changeTheme(themeName);
        }
      } else {
        res.profile.theme = DefaultConfig.theme;
        // setLocalStorage<UserInfo>(UserInfoKey, (state) => {
        //   state.profile.theme = DefaultConfig.theme;
        // });
        changeTheme(DefaultConfig.theme);
      }
      setUserInfo(res);
    },
  });

  useEffect(() => {
    changeTheme(themeName);
    // @ts-ignore
    document.body.style['zoom'] = FontSizeMap[fontSize]; // Non-standard: https://developer.mozilla.org/en-US/docs/Web/CSS/zoom
  }, []);

  return <ThemeProvider theme={theme}>{routesContent}</ThemeProvider>;
}

export default App;
