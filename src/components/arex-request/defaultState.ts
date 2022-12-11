import { State } from '.';

export const defaultState: State = {
  request: {
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
  },
  response: null,
  testResult: null,
  environment: { name: '', variables: [] },
  theme: 'light',
};
