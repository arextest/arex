import { ColorPrimary, getLocalStorage, MenusType, Theme } from 'arex-core';

declare module 'arex-core' {
  export enum PanesType {
    DEMO = 'Demo',
  }

  export enum MenusType {
    DEMO = 'Demo',
  }
}

export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

export enum MethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
export const methodMap = {
  GET: {
    color: '#0cbb52',
  },
  PUT: {
    color: '#097bed',
  },
  POST: {
    color: '#ffb400',
  },
  DELETE: {
    color: '#eb2013',
  },
  PATCH: {
    color: '#212121',
  },
};

export enum NodeType {
  interface = 1,
  case = 2,
  folder = 3,
}

// localStorage key
export const I18_KEY = 'i18nextLng';
export const THEME_KEY = 'theme';

// Default value
export const DEFAULT_ACTIVE_MENU = MenusType.ENVIRONMENT;
export const DEFAULT_THEME =
  getLocalStorage<Theme>(THEME_KEY) ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.dark : Theme.light);
export const DEFAULT_COLOR_PRIMARY = ColorPrimary.green;

export const MAX_PANES_COUNT = 8;
