import './style/index.less';
import './components/app/index.less';
import './components/httpRequest/CollectionMenu/index.less';
import './components/Environment/index.less';

import React, { useReducer } from 'react';
import { useRoutes } from 'react-router-dom';

import CheckChromeExtension from './components/CheckChromeExtension';
import routerConfig from './routers';
import ThemeProvider from './style/theme';

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

  return (
    <ThemeProvider>
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
