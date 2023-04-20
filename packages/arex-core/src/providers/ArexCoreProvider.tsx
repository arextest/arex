import React, { createContext, FC, PropsWithChildren } from 'react';

import { Theme } from '../theme';

export type ArexCoreProviderProps = {
  theme: Theme;
};

export const ArexCoreContext = createContext<ArexCoreProviderProps>({
  theme: Theme.light,
});

const ArexCoreProvider: FC<PropsWithChildren<ArexCoreProviderProps>> = (props) => {
  return (
    <ArexCoreContext.Provider value={{ theme: props.theme }}>
      {props.children}
    </ArexCoreContext.Provider>
  );
};
export default ArexCoreProvider;
