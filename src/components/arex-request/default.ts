import cn from './locales/cn.json';
import en from './locales/en.json';
import { themeMap } from './theme';
const localeMap = {
  cn: {
    type: 'cn',
    locale: cn,
  },
  en: {
    type: 'en',
    locale: en,
  },
};
export const globalDefaultState = {
  theme: themeMap.light,
  locale: localeMap.en,
  collectionTreeData: [],
  environment: {
    id: '0',
    envName: '',
    keyValues: [],
  },
};

export const defaultState = {
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
    compareEndpoint: '',
    compareMethod: '',
    params: [],
  },
  response: {
    type: 'null',
    headers: [],
    statusCode: 200,
    body: '',
    meta: {
      responseSize: 0,
      responseDuration: 1,
    },
    error: {
      name: '',
      message: '',
      stack: '',
    },
  },
  compareResponse: {
    type: 'null',
    headers: [],
    statusCode: 200,
    body: '',
    meta: {
      responseSize: 0,
      responseDuration: 1,
    },
    error: {
      name: '',
      message: '',
      stack: '',
    },
  },
  testResult: {},
};

export const Locale = {
  en: 'en',
  cn: 'cn',
};

export const Theme = {
  light: 'light',
  dark: 'dark',
};
