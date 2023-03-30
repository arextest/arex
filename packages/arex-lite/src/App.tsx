import { DevSupport } from '@react-buddy/ide-toolbox';
import React from 'react';
import { useRoutes } from 'react-router-dom';

import { ComponentPreviews, useInitial } from './dev';
import ConfigMiddlewareProvider from './providers/ConfigMiddlewareProvider';
import routerConfig from './router';
import MainProvider from './store/content/MainContent';
import ThemeMiddlewareProvider from './theme/ThemeMiddlewareProvider';

const App = () => {
  const routesContent = useRoutes(routerConfig);

  return (
    <MainProvider>
      <ConfigMiddlewareProvider>
        <ThemeMiddlewareProvider>
          <DevSupport ComponentPreviews={ComponentPreviews} useInitialHook={useInitial}>
            {routesContent}
          </DevSupport>
        </ThemeMiddlewareProvider>
      </ConfigMiddlewareProvider>
    </MainProvider>
  );
};

export default App;
