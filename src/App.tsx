import 'antd/dist/antd.less';
import './style/index.less';
import './components/app/index.less';

import { ThemeProvider } from '@emotion/react';
import { useMount } from 'ahooks';
import React, { useEffect, useMemo } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';

import CheckChromeExtension from './components/CheckChromeExtension';
import routerConfig from './routers';
import { AuthService } from './services/AuthService';
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

  useMount(() => {
    // - 请求登录接口/verify，验证成功接口返回accessToken和refreshToken字段。验证失败accessToken和refreshToken为空
    // - 以后每次请求都要在header上增加（access-token:具体的字符串）
    // - 在接口返回responseDesc:Authentication verification failed时，表明鉴权失败
    // - 在header带上（refresh-token:具体的字符串），请求/refresh/{username}接口，该接口会验证refreshToken是否过期，
    //   没有过期返回新的accessToken和refreshToken。过期返回responseDesc:Authentication verification failed
    // - 在/refresh/{username}接口返回responseDesc:Authentication verification failed，跳转到登录页面
    AuthService.refreshToken({ userName: 'tzhangm@trip.com' }).then((res) => {
      if (res.data.body) {
        const accessToken = res.data.body.accessToken;
        const refreshToken = res.data.body.refreshToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        console.log(window.location.pathname);
        if (window.location.pathname.includes('login')) {
        } else {
          localStorage.clear();
        }

        // window.location.href = '/login'
      }
    });
  });

  return (
    <ThemeProvider theme={theme}>
      <CheckChromeExtension />
      {routesContent}
    </ThemeProvider>
  );
}

export default App;
