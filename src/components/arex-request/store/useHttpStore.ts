import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Environment } from '../data/environment';
// import { HoppRESTRequest } from '../data/rest';
import { HoppRESTResponse } from '../helpers/types/HoppRESTResponse';
import { HoppTestResult } from '../helpers/types/HoppTestResult';

export type State = {
  response: HoppRESTResponse | undefined;
  testResult: HoppTestResult | undefined;
  environment: Environment;
  theme: 'dark' | 'light';
};

export type Action = {
  setHttpStore: (fn: (state: State) => void) => void;
};

const initialState: State = {
  response: undefined,
  testResult: undefined,
  environment: { name: '', variables: [] },
  theme: 'dark',
};
export const useHttpStore = create(
  immer<State & Action>((set, get) => ({
    ...initialState,
    setHttpStore: function (fn) {
      set(fn);
    },
  })),
);
// @ts-ignore
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('HttpStore', useHttpStore);
}
