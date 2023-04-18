import React from 'react';

import { GlobalConfigProvider, GlobalThemeProvider } from './providers';
import Routes from './router';

const App = () => {
  return (
    <GlobalThemeProvider>
      <GlobalConfigProvider>
        <Routes />
      </GlobalConfigProvider>
    </GlobalThemeProvider>
  );
};

export default App;
