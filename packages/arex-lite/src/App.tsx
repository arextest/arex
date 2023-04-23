import { ArexCoreProvider } from 'arex-core';
import React from 'react';

import Routes from './router';
import { useUserProfile } from './store';
import GlobalStyle from './style/GlobalStyle';

const App = () => {
  const { theme, compact, colorPrimary, language } = useUserProfile();

  // TODO inject locales resources
  return (
    <ArexCoreProvider
      theme={theme}
      language={language}
      compact={compact}
      colorPrimary={colorPrimary}
    >
      <GlobalStyle>
        <Routes />
      </GlobalStyle>
    </ArexCoreProvider>
  );
};

export default App;
