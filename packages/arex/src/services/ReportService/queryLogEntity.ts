import { request } from '../../utils';
import { NodePath } from './queryAllDiffMsg';

export interface QueryLogEntityReq {
  compareResultId: string;
  logIndex: number;
}

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

export interface QueryLogEntityRes {
  diffResultCode: number;
  logEntity: LogEntity;
}

export async function queryLogEntity(params: QueryLogEntityReq) {
  return request
    .post<QueryLogEntityRes>('/report/report/queryLogEntity', params)
    .then((res) => Promise.resolve([res.body.logEntity]));
}
