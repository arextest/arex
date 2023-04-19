export enum PanesType {
  REQUEST = 'Request',
  ENVIRONMENT = 'Environment',
}

export enum MenusType {
  ENVIRONMENT = 'Environment',
}

export enum NodeTypeEnum {
  request = 1,
  case = 2,
  folder = 3,
}
export enum MethodEnum {
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
