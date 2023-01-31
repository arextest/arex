import { ReactNode } from 'react';

import { HoppRESTAuth, HoppRESTRequest } from '../components/http/data/rest';
import { METHODS, NodeType } from '../constant';

export type KeyValueType = {
  key: string;
  value: string;
  active?: boolean;
};

export type Address = {
  method: (typeof METHODS)[number];
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

export type BaseInterface = {
  id: string;
  name: string | null;
  address: Address;
  preRequestScripts: HoppRESTRequest['preRequestScripts'];
  testScripts: HoppRESTRequest['testScripts'];
  body: { [key: string]: string };
  headers: KeyValueType[];
  params: KeyValueType[];
  auth: HoppRESTAuth | null;
  testAddress: Address;
  customTags: null;
  // interface unique attribute
  operationId?: string | null;
  operationResponse?: string | null;
  // case unique attribute
  recordId?: string | null;
  comparisonMsg?: null;
  labelIds?: string[];
  description?: string | null;
};

// ------ /api/filesystem/saveInterface ------
export interface SaveInterfaceReq extends Partial<BaseInterface> {
  workspaceId: string;
}

// ------ /api/filesystem/saveCase ------
export type SaveCaseReq =
  | (Partial<BaseInterface> & { workspaceId: string })
  | { id: string; labelIds: string[] };

//
export interface PinkMockReq {
  workspaceId: string;
  infoId: string;
  recordId: string;
  nodeType: number;
}
