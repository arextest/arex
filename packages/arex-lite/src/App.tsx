import { Empty, theme } from 'antd';
import { MappingAlgorithm } from 'antd/es/config-provider/context';
import { ArexCoreProvider, ColorPrimary, generateToken, Theme } from 'arex-core';
import React, { useMemo } from 'react';

import { DEFAULT_COLOR_PRIMARY, DEFAULT_THEME } from './constant';
import { I18nextLng, localeMap } from './i18n';
import { GlobalConfigProvider } from './providers';
import Routes from './router';
import { useUserProfile } from './store';
import GlobalStyle from './style/GlobalStyle';

const { darkAlgorithm, compactAlgorithm, defaultAlgorithm } = theme;

const App = () => {
  // TODO get from user profile
  const { theme } = useUserProfile();
  const compactMode = false;
  const colorPrimary = ColorPrimary.green;
  const language: I18nextLng = 'en-US';

  const algorithm = useMemo<MappingAlgorithm[]>(() => {
    const _algorithm = [defaultAlgorithm];
    theme === Theme.dark && _algorithm.push(darkAlgorithm);
    compactMode && _algorithm.push(compactAlgorithm);
    return _algorithm;
  }, [theme, compactMode]);

  return (
    <GlobalConfigProvider
      theme={{
        token: generateToken(theme, colorPrimary),
        algorithm,
      }}
      locale={localeMap[language]}
      renderEmpty={() => Empty.PRESENTED_IMAGE_SIMPLE}
    >
      <GlobalStyle>
        {/* arex-core default config */}
        <ArexCoreProvider theme={DEFAULT_THEME} colorPrimary={DEFAULT_COLOR_PRIMARY}>
          <Routes />
        </ArexCoreProvider>
      </GlobalStyle>
    </GlobalConfigProvider>
  );
};

export default App;
