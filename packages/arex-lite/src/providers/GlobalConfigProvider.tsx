import { ArexCoreProvider } from 'arex-core';
import React, { FC, PropsWithChildren } from 'react';

import useDarkMode from '../hooks/useDarkMode';

const GlobalConfigProvider: FC<PropsWithChildren> = (props) => {
  const darkMode = useDarkMode();

  return (
    <ArexCoreProvider darkMode={darkMode.value} locale={{}}>
      {props.children}
    </ArexCoreProvider>
  );
};
export default GlobalConfigProvider;
