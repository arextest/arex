import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { HoppRESTRequest } from '../data/rest';

export type State = HoppRESTRequest;

export type Action = {
  setHttpRequestStore: (fn: (state: State) => void) => void;
};

const initialState: State = {
  preRequestScript: '',
  v: '',
  headers: [],
  name: '',
  body: {
    contentType: 'application/json',
    body: '',
  },
  auth: {
    authURL: 'http://petstore.swagger.io/api/oauth/dialog',
    oidcDiscoveryURL: '',
    accessTokenURL: '',
    clientID: '',
    scope: 'write:pets read:pets',
    token: '',
    authType: 'oauth-2',
    authActive: true,
  },
  testScript: '',
  endpoint: '',
  method: '',
  params: [],
};
export const useHttpRequestStore = create(
  immer<State & Action>((set, get) => ({
    ...initialState,
    setHttpRequestStore: function (fn) {
      set(fn);
    },
  })),
);
// @ts-ignore
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('HttpRequestStore', useHttpRequestStore);
}
