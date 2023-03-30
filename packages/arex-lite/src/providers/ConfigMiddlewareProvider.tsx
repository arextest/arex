import { App, ConfigProvider, theme } from 'antd';
import React, { FC, PropsWithChildren, useContext } from 'react';

import { ArexCoreProvider } from '../../../arex-core';
import useDarkMode from '../hooks/use-dark-mode';
import { MainContext } from '../store/content/MainContent';

const { darkAlgorithm, useToken } = theme;

const ConfigMiddlewareProvider: FC<PropsWithChildren> = (props) => {
  const darkMode = useDarkMode();
  const { store } = useContext(MainContext);
  const token = useToken();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: store.settings.THEME_COLOR,
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
export default ConfigMiddlewareProvider;
