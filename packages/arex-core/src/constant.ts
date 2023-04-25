export const RouterPath = {
  RootPath: '/',
  WorkspaceIdPath: '/:workspaceId',
  MenuTypePath: '/:workspaceId/:menuType',
  PaneTypePath: '/:workspaceId/:menuType/:paneType',
  StandardPath: '/:workspaceId/:menuType/:paneType/:id',
};
export const StandardPathReg = '/:workspaceId/:menuType?/:paneType?/:id?';

export type StandardPathParams = {
  workspaceId: string;
  menuType: string;
  paneType: string;
  id: string;
};

export enum ArexPanesType {
  PANE_NOT_FOUND = 'pane-not-found',
  NO_PERMISSION = 'no-permission',
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

export enum RoleEnum {
  Admin = 1,
  Editor = 2,
  Viewer = 3,
}

export const RoleMap = {
  [RoleEnum.Admin]: 'Admin',
  [RoleEnum.Editor]: 'Editor',
  [RoleEnum.Viewer]: 'Viewer',
};

export const I18_KEY = 'i18nextLng';
