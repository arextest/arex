import { State } from '.';

export const defaultState: State = {
  request: {
    // @ts-ignore
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
    endpoint: '',
    method: 'GET',
    compareMethod: 'GET',
    compareEndpoint: '',
    params: [],
    preRequestScripts: [],
    testScripts: [],
  },
  response: null,
  testResult: null,
  environment: { name: '', variables: [] },
  theme: 'light',
  compareResult: {
    logs: [],
    responses: [{}, {}],
  },
  mode: 'normal',
  compareLoading: false,
};
