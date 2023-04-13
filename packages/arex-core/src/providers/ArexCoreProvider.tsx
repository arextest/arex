import { Draft, produce } from 'immer';
import { createContext, Dispatch, useReducer } from 'react';
interface State {
  darkMode: boolean;
  locale: any;
}
const defaultState = { darkMode: false, locale: {} };
export const HttpContext = createContext<
  { store: State } & { dispatch: Dispatch<(state: State) => void> }
>({
  store: defaultState,
  dispatch: () => undefined,
});
function reducer(draft: Draft<State>, action: (state: State) => void) {
  return action(draft);
}
const ArexCoreProvider = ({ children, darkMode, locale }: any) => {
  const [store, dispatch] = useReducer(produce(reducer), { darkMode: darkMode, locale });
  return <HttpContext.Provider value={{ store, dispatch }}>{children}</HttpContext.Provider>;
};
export default ArexCoreProvider;
