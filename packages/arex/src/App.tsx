import { LoadingOutlined } from '@ant-design/icons';
import { ArexCoreProvider, ArexMenuManager, ArexPaneManager, Theme } from '@arextest/arex-core';
import { Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

import { getThemeByDark, SYSTEM_THEME } from '@/constant';

import { useAuthentication, useTrace } from './hooks';
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
  useTrace('http://trace.arextest.com:8080/graphql');
  useAuthentication();

  const { theme: _theme, compact, colorPrimary, language } = useUserProfile();
  const [systemDarkTheme, setSystemDarkTheme] = useState(SYSTEM_THEME);
  const theme = useMemo(
    () => (_theme === Theme.system ? systemDarkTheme : _theme),
    [_theme, systemDarkTheme],
  );

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e: MediaQueryListEvent) => {
      setSystemDarkTheme(getThemeByDark(e.matches));
    };
    darkModeMediaQuery.addEventListener('change', updateTheme);
    return () => darkModeMediaQuery.removeEventListener('change', updateTheme);
  }, []);

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
