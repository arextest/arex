import { ReactNode } from 'react';

import { HoppRESTRequest } from '../components/arex-request/data/rest';
import { METHODS, NodeType } from '../constant';

export type KeyValueType = {
  key: string;
  value: string;
  active?: boolean;
};

export type Address = {
  method: typeof METHODS[number];
  endpoint: string;
};

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

// ------ /api/filesystem/queryInterface ------

export interface QueryInterfaceRes {
  id: string;
  name: string | null;
  address: Address;
  preRequestScripts: HoppRESTRequest['preRequestScripts'];
  testScripts: HoppRESTRequest['testScripts'];
  body: { [key: string]: string };
  headers: KeyValueType[];
  params: KeyValueType[];
  auth: null;
  testAddress: Address;
  customTags: null;
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

// ------ /api/filesystem/queryCase ------
export interface QueryCaseRes extends QueryInterfaceRes {
  recordId: string | null;
  comparisonMsg: null;
  labelIds: string[];
  description: null;
}
