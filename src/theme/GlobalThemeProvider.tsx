import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { ConfigProvider, theme } from 'antd';
import { MappingAlgorithm, ThemeConfig } from 'antd/es/config-provider/context';
import { AliasToken } from 'antd/lib/theme/interface';
import { FC, ReactNode, useMemo } from 'react';

declare module '@emotion/react' {
  export interface Theme extends AliasToken {
    colorPrimary: string;
  }
}

const { defaultSeed } = theme;

const GlobalThemeProvider: FC<{ theme: ThemeConfig; children: ReactNode }> = (props) => {
  const algorithms: MappingAlgorithm[] = Array.isArray(props.theme.algorithm)
    ? props.theme.algorithm
    : [];
  const theme = useMemo(() => {
    let _theme = { ...defaultSeed, ...props.theme.token };
    algorithms.forEach((algorithm) => {
      _theme = algorithm(_theme);
    });
    return _theme;
  }, [props.theme]);

  return (
    <ConfigProvider theme={props.theme}>
      <EmotionThemeProvider theme={theme}>{props.children}</EmotionThemeProvider>
    </ConfigProvider>
  );
};

export default GlobalThemeProvider;
