export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
export enum MethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum NodeType {
  interface = 1,
  case = 2,
  folder = 3,
}

export enum PageTypeEnum {
  Request = 'request',
  Replay = 'replay',
  Folder = 'folder',
  Collection = 'collection',
  Environment = 'environment',
  Login = 'login',
}

export enum ContentTypeEnum {
  ApplicationJson = 'application/json',
}
