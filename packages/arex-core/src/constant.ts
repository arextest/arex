export const RouterPath = {
  RootPath: '/',
  MenuTypePath: '/:menuType',
  PaneTypePath: '/:menuType/:paneType',
  StandardPath: '/:menuType/:paneType/:id',
};
export const StandardPathReg = '/:menuType?/:paneType?/:id?';

export type StandardPathParams = {
  workspaceId: string;
  menuType: string;
  paneType: string;
  id: string;
};

export enum ArexPanesType {
  PANE_NOT_FOUND = 'pane-not-found',
  NO_PERMISSION = 'no-permission',
  WEB_VIEW = 'web-view',
}

export enum ArexMenusType {}

export const ArexMenuNamespace = 'arex-menu';
export const ArexPaneNamespace = 'arex-pane';

export const RequestMethod = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

export enum RequestMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export const I18_KEY = 'i18nextLng';
