import React from 'react';

import { GlobalConfigProvider, GlobalThemeProvider } from './providers';
import Routes from './router';

const App = () => {
  return (
    <GlobalConfigProvider>
      <GlobalThemeProvider>
        <Routes />
      </GlobalThemeProvider>
    </GlobalConfigProvider>
  );
};

export default App;
