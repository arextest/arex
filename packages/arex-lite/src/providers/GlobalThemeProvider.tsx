import { ThemeProvider } from '@emotion/react';
import { App, ConfigProvider, theme } from 'antd';
import React, { FC, PropsWithChildren } from 'react';

import useDarkMode from '../hooks/useDarkMode';

const { darkAlgorithm, useToken } = theme;

const GlobalThemeProvider: FC<PropsWithChildren> = (props) => {
  const { token } = useToken();
  const darkMode = useDarkMode();

  return (
    <ConfigProvider
      theme={{
        token: {
          // colorPrimary: store.settings.THEME_COLOR,
          // colorBorder: token.token.colorSplit,
        },
        algorithm: darkMode.value ? [darkAlgorithm] : [],
      }}
    >
      <App>
        <ThemeProvider theme={token}>{props.children}</ThemeProvider>
      </App>
    </ConfigProvider>
  );
};
export default GlobalThemeProvider;
