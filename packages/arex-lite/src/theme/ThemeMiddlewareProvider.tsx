import { ThemeProvider } from '@emotion/react';
import { theme } from 'antd';
import { FC, PropsWithChildren } from 'react';

const { useToken } = theme;
const ThemeMiddlewareProvider: FC<PropsWithChildren> = (props) => {
  const token = useToken();

  return <ThemeProvider theme={token.token}>{props.children}</ThemeProvider>;
};
export default ThemeMiddlewareProvider;
