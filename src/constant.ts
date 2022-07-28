export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

export enum NodeType {
  interface = 1,
  case = 2,
  folder = 3,
}

export enum PageType {
  'request' = 'request',
  'replay' = 'replay',
  'folder' = 'folder',
  'collection' = 'collection',
  'environment' = 'environment',
  'login' = 'login',
}
