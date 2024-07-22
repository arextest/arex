import { LoadingOutlined } from '@ant-design/icons';
import { ArexCoreProvider, ArexMenuManager, ArexPaneManager, Theme } from '@arextest/arex-core';
import { Layout, Spin } from 'antd';
import React from 'react';

import { NavigationProvider } from '@/router/NavigationContext';

import { useAuthentication, useTrace } from './hooks';
import useDarkMode from './hooks/useDarkMode';
import resources from './i18n';
import Menus from './menus';
import Panes from './panes';
import Routes from './router';
import { useUserProfile } from './store';
import GlobalStyle from './style/GlobalStyle';

// set default loading indicator
Spin.setDefaultIndicator(<LoadingOutlined spin />);

// register menus and panes
ArexPaneManager.registerPanes(Panes);
ArexMenuManager.registerMenus(Menus);

const App = () => {
  useTrace('http://trace.arextest.com/graphql');
  useAuthentication();

  const { theme: _theme, compact, colorPrimary, language } = useUserProfile();
  const darkMode = useDarkMode();
  const theme = darkMode ? Theme.dark : Theme.light;

  return (
    <ArexCoreProvider
      theme={theme}
      language={language}
      localeResources={resources}
      compact={compact}
      colorPrimary={colorPrimary}
      appProps={{
        message: {
          duration: 2,
          maxCount: 1,
        },
      }}
    >
      <GlobalStyle>
        <NavigationProvider>
          <Layout>
            <Layout.Content>
              <Routes />
            </Layout.Content>
          </Layout>
        </NavigationProvider>
      </GlobalStyle>
    </ArexCoreProvider>
  );
};

export default App;
