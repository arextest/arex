import { ArexCoreProvider, ArexMenuManager, ArexPaneManager } from 'arex-core';
import React from 'react';

import { resources } from './i18n';
import Menus from './menus';
import Panes from './panes';
import Routes from './router';
import { useUserProfile } from './store';
import GlobalStyle from './style/GlobalStyle';

// register menus and panes
ArexPaneManager.registerPanes(Panes);
ArexMenuManager.registerMenus(Menus);

const App = () => {
  const { theme, compact, colorPrimary, language } = useUserProfile();

  return (
    <ArexCoreProvider
      theme={theme}
      language={language}
      localeResources={resources}
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
