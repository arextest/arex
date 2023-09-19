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

export enum MenuTypeEnum {
  Collection = 'collection',
  Replay = 'replay',
  Environment = 'environment',
}

export enum PageTypeEnum {
  Setting = 'setting',
  Request = 'request',
  Example = 'example',
  Folder = 'folder',
  Run = 'run',
  Collection = 'collection',
  Environment = 'environment',
  Workspace = 'workspace',
  Replay = 'replay',
  ReplayAnalysis = 'replayAnalysis',
  ReplayCase = 'replayCase',
}

export enum ContentTypeEnum {
  ApplicationJson = 'application/json',
}

export enum RoleEnum {
  Admin = 1,
  Editor = 2,
  Viewer = 3,
}
