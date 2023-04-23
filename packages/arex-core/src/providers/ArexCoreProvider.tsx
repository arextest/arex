import { App as AppWrapper, ConfigProvider, Empty, Layout, theme } from 'antd';
import { MappingAlgorithm } from 'antd/es/config-provider/context';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import React, { createContext, FC, PropsWithChildren, useMemo } from 'react';

import { I18nextLng } from '../i18n';
import { ColorPrimary, generateToken, Theme } from '../theme';
import EmotionThemeProvider from './EmotionThemeProvider';

const { Content } = Layout;
const { darkAlgorithm, compactAlgorithm, defaultAlgorithm } = theme;
const localeMap = {
  [I18nextLng.en]: enUS,
  [I18nextLng.cn]: zhCN,
};

export type ArexCoreProviderProps = {
  theme: Theme;
  compact: boolean;
  colorPrimary: ColorPrimary;
  language: I18nextLng;
};

export const ArexCoreContext = createContext<ArexCoreProviderProps>({
  theme: Theme.light,
  compact: false,
  colorPrimary: ColorPrimary.green,
  language: I18nextLng.en,
});

const ArexCoreProvider: FC<PropsWithChildren<Partial<ArexCoreProviderProps>>> = (props) => {
  const {
    theme = Theme.light,
    compact = false,
    colorPrimary = ColorPrimary.green,
    language = I18nextLng.en,
  } = props;

  const algorithm = useMemo<MappingAlgorithm[]>(() => {
    const _algorithm = [defaultAlgorithm];
    theme === Theme.dark && _algorithm.push(darkAlgorithm);
    compact && _algorithm.push(compactAlgorithm);
    return _algorithm;
  }, [theme, compact]);

  return (
    <ConfigProvider
      theme={{
        token: generateToken(theme, colorPrimary),
        algorithm,
      }}
      locale={localeMap[language]}
      renderEmpty={() => Empty.PRESENTED_IMAGE_SIMPLE}
    >
      <EmotionThemeProvider>
        <AppWrapper>
          <Layout>
            <Content>
              <ArexCoreContext.Provider value={{ theme, compact, colorPrimary, language }}>
                {props.children}
              </ArexCoreContext.Provider>
            </Content>
          </Layout>
        </AppWrapper>
      </EmotionThemeProvider>
    </ConfigProvider>
  );
};
export default ArexCoreProvider;
