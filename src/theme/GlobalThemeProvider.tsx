import { ThemeProvider } from '@emotion/react';
import { ConfigProvider, theme } from 'antd';
import { ThemeConfig } from 'antd/es/config-provider/context';
import { AliasToken } from 'antd/lib/theme/interface';
import { FC, ReactNode } from 'react';

declare module '@emotion/react' {
  export interface Theme extends AliasToken {
    colorPrimary: string;
  }
}

const EmotionThemeProvider: FC<{ children: ReactNode }> = (props) => {
  const { token } = theme.useToken();
  return <ThemeProvider theme={token}>{props.children}</ThemeProvider>;
};

const GlobalThemeProvider: FC<{ theme: ThemeConfig; children: ReactNode }> = (props) => (
  <ConfigProvider theme={props.theme}>
    <EmotionThemeProvider>{props.children}</EmotionThemeProvider>
  </ConfigProvider>
);

export default GlobalThemeProvider;
