export type InfoItem = {
  id: string;
  code: number;
  categoryName: string; // 等效于 operationType，后端字段暂时未修改
  operationType: string; // 接口中暂不存在该字段
  instanceId: string;
  dependencyId: string;
  operationId: string;
  operationName: string;
  isEntry?: boolean;
};

export interface NodePath {
  nodeName: string;
  index: number;
}

export type DiffLog = {
  nodePath: NodePath[];
  logIndex: number | null;
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
