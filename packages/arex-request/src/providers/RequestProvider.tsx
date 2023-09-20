import produce, { Draft } from 'immer';
import React, { createContext, Dispatch, FC, PropsWithChildren, useReducer } from 'react';

import { ArexRESTResponse } from '../types/ArexRESTResponse';
import { Environment } from '../types/environment';
import { PostmanTestResult } from '../types/PostmanTestResult';
import { ArexRESTRequest } from '../types/rest';
import { defaultState } from './defaultState';

export interface State {
  request: ArexRESTRequest;
  edited: boolean;
  environment: Environment;
  response: ArexRESTResponse | null;
  testResult: PostmanTestResult | null;
  consoles: any[];
  visualizer: {
    error: null | string;
    data: any;
    processedTemplate: string;
  };
}

export const Context = createContext<
  { store: State } & { dispatch: Dispatch<(state: State) => void> }
>({
  store: defaultState,
  dispatch: () => undefined,
});
function reducer(draft: Draft<State>, action: (state: State) => void) {
  return action(draft);
}
const RequestProvider: FC<PropsWithChildren<Partial<State>>> = (props) => {
  const [store, dispatch] = useReducer(produce(reducer), defaultState);
  return (
    <Context.Provider
      value={{
        store,
        dispatch,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default RequestProvider;
