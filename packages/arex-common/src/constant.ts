// interface

export interface CollectionTreeNode {
  id: string;
  key: string;
  method: MethodEnum;
  nodeType: NodeTypeEnum;
  title: string;
  children: Array<CollectionTreeNode>;
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
