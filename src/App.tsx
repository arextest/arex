import './components/app/index.less';
import './components/HttpRequest/CollectionMenu/index.less';
import './components/Environment/index.less';

import { ThemeProvider } from '@emotion/react';
import React, { useReducer } from 'react';
import { useRoutes } from 'react-router-dom';

import CheckChromeExtension from './components/CheckChromeExtension';
import routerConfig from './routers';
import { Theme, themeCreator } from './style/theme';

export const GlobalContext = React.createContext({});
const theme = themeCreator(Theme.light); // TODO theme support

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
  const useRoutesRouterConfig = useRoutes(routerConfig);
  return (
    <ThemeProvider theme={theme}>
      <GlobalContext.Provider
        value={{
          state,
          dispatch,
        }}
      >
        <CheckChromeExtension />
        {useRoutesRouterConfig}
      </GlobalContext.Provider>
    </ThemeProvider>
  );
}

export default App;
