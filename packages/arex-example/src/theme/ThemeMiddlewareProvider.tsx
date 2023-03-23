import { ThemeProvider } from '@emotion/react';
import { theme } from 'antd';
import { useRoutes } from 'react-router-dom';

import routerConfig from '../router';

const { useToken } = theme;
const ThemeMiddlewareProvider = () => {
  const routesContent = useRoutes(routerConfig);
  const token = useToken();

  return (
    <div>
      <ThemeProvider theme={token.token}>{routesContent}</ThemeProvider>
    </div>
  );
};
export default ThemeMiddlewareProvider;
