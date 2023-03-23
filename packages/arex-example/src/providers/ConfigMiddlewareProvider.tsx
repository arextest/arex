import { App, ConfigProvider, theme } from 'antd';
import { useContext } from 'react';

import useDarkMode from '../hooks/use-dark-mode';
import { MainContext } from '../store/content/MainContent';
const { darkAlgorithm, useToken } = theme;
import { ArexCommonProvider } from 'arex-common';
const ConfigMiddlewareProvider = ({ children }: any) => {
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
      <ArexCommonProvider darkMode={darkMode.value} locale={{}}>
        <App>{children}</App>
      </ArexCommonProvider>
    </ConfigProvider>
  );
};
export default ConfigMiddlewareProvider;
