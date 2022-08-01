import 'antd/dist/antd.less';
import './style/index.less';
import './components/app/index.less';

import { ThemeProvider } from '@emotion/react';
import React, { useEffect, useMemo, useReducer } from 'react';
import { useRoutes } from 'react-router-dom';

import CheckChromeExtension from './components/CheckChromeExtension';
import routerConfig from './routers';
import { useStore } from './store';
import { Theme, themeCreator } from './style/theme';

export const GlobalContext = React.createContext({});

const initState = {
  userinfo: {
    email: localStorage.getItem('email'),
  },
  isLogin: !!localStorage.getItem('email'),
};
const reducer = (prevState, action) => {
  const newState = { ...prevState };
  switch (action.type) {
    case 'login':
      newState.userinfo.email = action.payload;
      newState.isLogin = true;
      return newState;
    default:
      return newState;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initState);
  const routesContent = useRoutes(routerConfig);
  const { theme: themeName, changeTheme } = useStore();
  const theme = useMemo(() => themeCreator(themeName), [themeName]);

  // init theme
  useEffect(() => {
    changeTheme(themeName);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalContext.Provider
        value={{
          state,
          dispatch,
        }}
      >
        <CheckChromeExtension />
        {routesContent}
      </GlobalContext.Provider>
    </ThemeProvider>
  );
}

export default App;
