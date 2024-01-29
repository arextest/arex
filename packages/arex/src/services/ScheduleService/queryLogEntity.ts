import { NodePath } from '@/services/ReportService';
import { request } from '@/utils';

export interface QueryLogEntityReq {
  compareResultId: string;
  logIndex: number;
}

export interface Trace {
  currentTraceLeft?: any;
  currentTraceRight?: any;
}

export enum DIFF_TYPE {
  LEFT_MISSING = 1,
  RIGHT_MISSING = 2,
  UNMATCHED = 3,
}

export interface PathPair {
  unmatchedType: DIFF_TYPE;
  leftUnmatchedPath: NodePath[];
  rightUnmatchedPath: NodePath[];
  listKeys?: any[];
  listKeyPath?: any[];
  trace: Trace;
}

export type LogEntity = {
  addRefPkNodePathLeft?: null;
  addRefPkNodePathRight?: null;
  baseValue: string | boolean | null;
  testValue: string | boolean | null;
  logInfo: string;
  logTag: Record<string, string | number>;
  path?: string | null;
  pathPair: PathPair;
  warn: number;
};

export interface QueryLogEntityRes {
  diffResultCode: number;
  logEntity: LogEntity;
}

export async function queryLogEntity(params: QueryLogEntityReq) {
  return request
    .post<QueryLogEntityRes>('/schedule/report/queryLogEntity', params)
    .then((res) => Promise.resolve(res.body.logEntity));
}
