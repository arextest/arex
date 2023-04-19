import { ThemeProvider } from '@emotion/react';
import { ConfigProvider, theme } from 'antd';
import { ConfigProviderProps } from 'antd/es/config-provider';
import { ArexCoreProvider } from 'arex-core';
import React, { FC, ReactNode } from 'react';

import useDarkMode from '../hooks/useDarkMode';

const EmotionThemeProvider: FC<{ children: ReactNode }> = (props) => {
  const { token } = theme.useToken();
  return <ThemeProvider theme={token}>{props.children}</ThemeProvider>;
};

const GlobalConfigProvider: FC<ConfigProviderProps> = (props) => {
  const darkMode = useDarkMode();

  return (
    <ConfigProvider {...props}>
      <EmotionThemeProvider>
        <ArexCoreProvider darkMode={darkMode.value} locale={{}}>
          {props.children}
        </ArexCoreProvider>
      </EmotionThemeProvider>
    </ConfigProvider>
  );
};
export default GlobalConfigProvider;
