import { Empty, theme } from 'antd';
import { MappingAlgorithm } from 'antd/es/config-provider/context';
import { ArexCoreProvider, ColorPrimary, generateToken, Theme } from 'arex-core';
import React, { useMemo } from 'react';

import { localeMap } from './i18n';
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
  const language = 'en-US';

  const algorithm = useMemo<MappingAlgorithm[]>(() => {
    const _algorithm = [defaultAlgorithm];
    theme === Theme.dark && _algorithm.push(darkAlgorithm);
    compactMode && _algorithm.push(compactAlgorithm);
    return _algorithm;
  }, [theme, compactMode]);

  return (
    <GlobalStyle>
      <GlobalConfigProvider
        theme={{
          token: generateToken(theme, colorPrimary),
          algorithm,
        }}
        locale={localeMap[language]}
        renderEmpty={() => Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <ArexCoreProvider theme={Theme.light} colorPrimary={colorPrimary} locale={{}}>
          <Routes />
        </ArexCoreProvider>
      </GlobalConfigProvider>
    </GlobalStyle>
  );
};

export default App;
