import { LoadingOutlined } from '@ant-design/icons';
import { ArexCoreProvider, ArexMenuManager, ArexPaneManager, Theme } from '@arextest/arex-core';
import { Spin } from 'antd';
import React, { useEffect } from 'react';

import { useAuthentication, useTrace } from './hooks';
import useDarkMode from './hooks/useDarkMode';
import resources from './i18n';
import Menus from './menus';
import Panes from './panes';
import Routes from './router';
import { useUserProfile } from './store';
import useClientStore from './store/useClientStore';
import GlobalStyle from './style/GlobalStyle';

// set default loading indicator
Spin.setDefaultIndicator(<LoadingOutlined spin />);

// register menus and panes
ArexPaneManager.registerPanes(Panes);
ArexMenuManager.registerMenus(Menus);

const App = () => {
  const [ready, setReady] = React.useState(false);

  useTrace('http://trace.arextest.com/graphql');
  useAuthentication();

  const { theme: _theme, compact, colorPrimary, language } = useUserProfile();
  const darkMode = useDarkMode();
  const theme = darkMode ? Theme.dark : Theme.light;

  useEffect(() => {
    useClientStore
      .getState()
      .getOrganization()
      .then(() => setReady(true));
  }, []);
  if (!ready) return <Spin spinning />;

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
