import { ThemeProvider } from '@emotion/react';
import { ConfigProvider, theme } from 'antd';
import { ConfigProviderProps } from 'antd/lib/config-provider';
import { AliasToken } from 'antd/lib/theme/interface';
import React, { FC, ReactNode } from 'react';

declare module '@emotion/react' {
  export interface Theme extends AliasToken {
    colorPrimary: string;
  }
}

const EmotionThemeProvider: FC<{ children: ReactNode }> = (props) => {
  const { token } = theme.useToken();
  return <ThemeProvider theme={token}>{props.children}</ThemeProvider>;
};

const GlobalConfigProvider: FC<ConfigProviderProps> = (props) => (
  <ConfigProvider {...props}>
    <EmotionThemeProvider>{props.children}</EmotionThemeProvider>
  </ConfigProvider>
);

export default GlobalConfigProvider;
