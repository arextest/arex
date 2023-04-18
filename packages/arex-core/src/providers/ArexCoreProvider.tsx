import React, { createContext, FC, PropsWithChildren, useReducer, useState } from 'react';

interface State {
  darkMode: boolean;
  locale: any;
}

const defaultState: State = { darkMode: false, locale: {} };

export const ArexCoreContext = createContext(defaultState);

const ArexCoreProvider: FC<PropsWithChildren<State>> = (props) => {
  const [darkMode, setDarkMode] = useState(props.darkMode);
  return (
    <ArexCoreContext.Provider value={{ darkMode, locale: props.locale }}>
      {props.children}
    </ArexCoreContext.Provider>
  );
};
export default ArexCoreProvider;
