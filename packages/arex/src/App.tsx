import {
  ArexCoreProvider,
  ArexMenuManager,
  ArexPaneManager,
  getLocalStorage,
} from '@arextest/arex-core';
import * as Sentry from '@sentry/react';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { EMAIL_KEY } from '@/constant';
import { request } from '@/utils';

import { useAuthentication } from './hooks';
import resources from './i18n';
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
  const loc = useLocation();
  useEffect(() => {
    request.post('http://trace.arextest.com:8080/graphql', {
      query: `mutation ReportTraceData($data: String!) {    reportTraceData(data: $data) {id}}`,
      operationName: 'ReportTraceData',
      variables: {
        data: JSON.stringify([
          {
            key: 'url',
            value: loc.pathname,
          },
          {
            key: 'username',
            value: getLocalStorage(EMAIL_KEY) || 'unknown',
          },
        ]),
      },
    });
  }, [loc]);
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
