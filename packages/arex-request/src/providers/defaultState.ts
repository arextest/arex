import { State } from './ConfigProvider';

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
      authActive: false,
      authType: 'none',
    },
    testScript: '',
    endpoint: '',
    method: '',
    params: [],
    inherited: false,
    inheritedEndpoint: '',
    inheritedMethod: '',
    description: 'miaoshu',
  },
  edited: false,
  response: null,
  consoles: [],
  environment: { name: 'dev', variables: [{ key: 'name', value: 'ssss' }] },
  theme: 'light',
  locale: 'en',
  testResult: null,
  visualizer: {
    error: null,
    data: null,
    processedTemplate: '',
  },
};
