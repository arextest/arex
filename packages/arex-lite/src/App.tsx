import { Empty, theme } from 'antd';
import { MappingAlgorithm } from 'antd/es/config-provider/context';
import React, { useMemo } from 'react';

import { localeMap } from './i18n';
import { GlobalConfigProvider } from './providers';
import Routes from './router';
import GlobalStyle from './style/GlobalStyle';
import { ColorPrimary, generateToken, Theme } from './style/theme';

const { darkAlgorithm, compactAlgorithm, defaultAlgorithm } = theme;

const App = () => {
  // TODO get from user profile and refactor useDarkMode hook
  const darkMode = false;
  const compactMode = false;
  const theme = Theme.light;
  const colorPrimary = ColorPrimary.green;
  const language = 'en-US';

  const algorithm = useMemo<MappingAlgorithm[]>(() => {
    const _algorithm = [defaultAlgorithm];
    darkMode && _algorithm.push(darkAlgorithm);
    compactMode && _algorithm.push(compactAlgorithm);
    return _algorithm;
  }, [darkMode, compactMode]);

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
        <Routes />
      </GlobalConfigProvider>
    </GlobalStyle>
  );
};

export default App;
