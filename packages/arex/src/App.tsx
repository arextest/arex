import { ArexCoreProvider, ArexMenuManager, ArexPaneManager } from '@arextest/arex-core';
import { getLocalStorage } from '@arextest/arex-core/src';
import * as Sentry from '@sentry/react';
import React from 'react';

import { EMAIL_KEY } from '@/constant';

import { useAuthentication } from './hooks';
import { resources } from './i18n';
import Menus from './menus';
import Panes from './panes';
import Routes from './router';
import { useUserProfile } from './store';
import GlobalStyle from './style/GlobalStyle';

// register menus and panes
ArexPaneManager.registerPanes(Panes);
ArexMenuManager.registerMenus(Menus);
const email = getLocalStorage<string>(EMAIL_KEY);
const App = () => {
  if (email) {
    Sentry.setTag('arex-user', email);
  }
  useAuthentication();
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
