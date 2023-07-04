import {
  ColorPrimary,
  getLocalStorage,
  I18nextLng,
  RequestMethodEnum,
  Theme,
} from '@arextest/arex-core';

export enum PanesType {
  DEMO = 'demo',
  COMPONENTS = 'components',
}

export enum MenusType {
  DEMO = 'demo',
}

export const methodMap: Record<RequestMethodEnum, { color: string }> = {
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
export const THEME_KEY = 'theme';

// Default value
export const DEFAULT_LANGUAGE = I18nextLng.en;
export const DEFAULT_ACTIVE_MENU = MenusType.ENVIRONMENT;
export const DEFAULT_THEME =
  getLocalStorage<Theme>(THEME_KEY) ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.dark : Theme.light);
export const DEFAULT_COLOR_PRIMARY = ColorPrimary.green;

export const MAX_PANES_COUNT = 8;
