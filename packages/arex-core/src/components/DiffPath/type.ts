export type infoItem = {
  id: string;
  code: number;
  categoryName: string;
  operationName: string;
};

export interface NodePath {
  nodeName: string;
  index: number;
}

export type DiffLog = {
  nodePath: NodePath[];
  logIndex: number;
};

export interface Trace {
  currentTraceLeft?: any;
  currentTraceRight?: any;
}

export interface PathPair {
  unmatchedType: number;
  leftUnmatchedPath: NodePath[];
  rightUnmatchedPath: NodePath[];
  listKeys: any[];
  listKeyPath: any[];
  trace: Trace;
}

export type LogEntity = {
  addRefPkNodePathLeft: null;
  addRefPkNodePathRight: null;
  baseValue: string | boolean | null;
  testValue: string | boolean | null;
  logInfo: string;
  logTag: Record<string, string | number>;
  path: string | null;
  pathPair: PathPair;
  warn: number;
};
