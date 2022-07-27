export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

export enum NodeType {
  interface = 1,
  case = 2,
  folder = 3,
}

export type PageType = 'request' | 'replay' | 'collection' | 'environment' | 'login';
