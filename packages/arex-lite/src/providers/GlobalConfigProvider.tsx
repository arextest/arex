import { App, ConfigProvider, theme } from 'antd';
import React, { FC, PropsWithChildren } from 'react';

import { ArexCoreProvider } from '../../../arex-core';
import useDarkMode from '../hooks/useDarkMode';

const { darkAlgorithm } = theme;

const GlobalConfigProvider: FC<PropsWithChildren> = (props) => {
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
      <ArexCoreProvider darkMode={darkMode.value} locale={{}}>
        <App>{props.children}</App>
      </ArexCoreProvider>
    </ConfigProvider>
  );
};
export default GlobalConfigProvider;
