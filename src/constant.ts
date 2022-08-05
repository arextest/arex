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

export enum MenuTypeEnum {
  Collection = 'collection',
  Replay = 'replay',
  Environment = 'environment',
}

export enum PageTypeEnum {
  Request = 'request',
  Replay = 'replay',
  Folder = 'folder',
  Collection = 'collection',
  Environment = 'environment',
  WorkspaceOverview = 'workspaceOverview',
  ReplayAnalysis = 'replayAnalysis',
  ReplayCase = 'ReplayCase',
}

export enum ContentTypeEnum {
  ApplicationJson = 'application/json',
}
