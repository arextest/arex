import React from 'react';
import { useRoutes } from 'react-router-dom';

import ConfigMiddlewareProvider from './providers/ConfigMiddlewareProvider';
import routerConfig from './router';
import ThemeMiddlewareProvider from './theme/ThemeMiddlewareProvider';

const App = () => {
  const routesContent = useRoutes(routerConfig);

  return (
    <ConfigMiddlewareProvider>
      <ThemeMiddlewareProvider>{routesContent}</ThemeMiddlewareProvider>
    </ConfigMiddlewareProvider>
  );
};

export default App;
