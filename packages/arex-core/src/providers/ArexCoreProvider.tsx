import React, { createContext, FC, PropsWithChildren, useState } from 'react';

import { ColorPrimary, Theme } from '../theme';

export type ArexCoreProviderProps = {
  theme: Theme;
  colorPrimary: ColorPrimary;
  locale: any;
};

export const ArexCoreContext = createContext<
  ArexCoreProviderProps & {
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
    setColorPrimary: React.Dispatch<React.SetStateAction<ColorPrimary>>;
  }
>({
  theme: Theme.light,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTheme: () => {},
  colorPrimary: ColorPrimary.green,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setColorPrimary: () => {},
  locale: {},
});

const ArexCoreProvider: FC<PropsWithChildren<ArexCoreProviderProps>> = (props) => {
  const [theme, setTheme] = useState(props.theme);
  const [colorPrimary, setColorPrimary] = useState(props.colorPrimary);

  return (
    <ArexCoreContext.Provider
      value={{ theme, setTheme, colorPrimary, setColorPrimary, locale: props.locale }}
    >
      {props.children}
    </ArexCoreContext.Provider>
  );
};
export default ArexCoreProvider;
