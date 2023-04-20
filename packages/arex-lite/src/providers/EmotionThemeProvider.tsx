import { ThemeProvider } from '@emotion/react';
import { theme } from 'antd';
import React, { FC, ReactNode } from 'react';

const EmotionThemeProvider: FC<{ children: ReactNode }> = (props) => {
  const { token } = theme.useToken();
  return <ThemeProvider theme={token}>{props.children}</ThemeProvider>;
};

export default EmotionThemeProvider;
