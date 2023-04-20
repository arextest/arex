import { App as AppWrapper, ConfigProvider, Layout } from 'antd';
import { ConfigProviderProps } from 'antd/es/config-provider';
import React, { FC } from 'react';

import EmotionThemeProvider from './EmotionThemeProvider';

const { Content } = Layout;

const GlobalConfigProvider: FC<ConfigProviderProps> = (props) => {
  return (
    <ConfigProvider {...props}>
      <EmotionThemeProvider>
        <AppWrapper>
          <Layout>
            <Content>{props.children}</Content>
          </Layout>
        </AppWrapper>
      </EmotionThemeProvider>
    </ConfigProvider>
  );
};
export default GlobalConfigProvider;
