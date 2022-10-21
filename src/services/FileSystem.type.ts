import { ReactNode } from 'react';

import { METHODS, NodeType } from '../constant';
import { KeyValueType } from '../pages/HttpRequestPage';

// ------ /api/filesystem/queryWorkspaceById ------
export interface QueryWorkspaceByIdReq {
  id: string;
}
export type RootParadigmNode = {
  infoId: string;
  nodeName: string;
};
export type RootParadigmKey = {
  key: string;
  title: string;
  icon?: ReactNode;
};
export type Root<T = RootParadigmNode | RootParadigmKey> = {
  nodeType: NodeType;
  children: Root<T>[] | null;
} & T;
type FsTree = {
  id: string;
  roots: Root<RootParadigmNode>[];
  userName: string;
  workspaceName: string;
};
export interface QueryWorkspaceByIdRes {
  fsTree: FsTree;
}

// ------ /api/filesystem/saveInterface ------
export interface QueryInterfaceReq {
  id: string;
}
export interface QueryInterfaceRes {
  id: string;
  endpoint: string | null;
  method: typeof METHODS[number] | null;
  preRequestScript: string | null;
  testScript: string | null;
  body: object | null;
  headers: object | null;
  params: object | null;
  auth: string | null;
}

// ------ /api/filesystem/saveInterface ------
export interface SaveInterfaceReq {
  auth: {
    authActive: boolean;
    authType: string;
    token: string;
  } | null;
  body: { contentType: string; body: string | null };
  endpoint: string;
  headers: KeyValueType[];
  id: string;
  method: string;
  params: KeyValueType[];
  preRequestScript: string | null;
  testScript: string | null;
}
export interface SaveInterfaceRes {
  success: boolean;
}
