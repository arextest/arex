import { tryParseJsonString } from '../../utils';

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

export const DIFF_TYPE = {
  LEFT_MISSING: 1,
  RIGHT_MISSING: 2,
  UNMATCHED: 3,
};

export type AllDiff = { more: React.Key[][]; diff: React.Key[][] };

export function genAllDiffByType(type: 'left' | 'right', logs?: LogEntity[]) {
  const allDiff: AllDiff = {
    more: [],
    diff: [],
  };
  if (!logs || !logs.length) return allDiff;
  for (let j = 0; j < logs.length; j++) {
    const arr: React.Key[] = [];
    for (let i = 0; i < logs[j].pathPair[`${type}UnmatchedPath`].length; i++) {
      arr.push(
        logs[j].pathPair[`${type}UnmatchedPath`][i].nodeName
          ? logs[j].pathPair[`${type}UnmatchedPath`][i].nodeName
          : logs[j].pathPair[`${type}UnmatchedPath`][i].index,
      );
    }
    if (!logs[j].logTag.ig) {
      if (
        [DIFF_TYPE.LEFT_MISSING, DIFF_TYPE.RIGHT_MISSING].includes(logs[j].pathPair.unmatchedType)
      ) {
        allDiff.more.push(arr);
      } else if ([DIFF_TYPE.UNMATCHED].includes(logs[j].pathPair.unmatchedType)) {
        allDiff.diff.push(arr);
      }
    }
  }
  return allDiff;
}

/**
 * 根据 path 获取 json 的 value
 * @param object
 * @param path
 */
export function getJsonValueByPath(object: any, path: string[]) {
  const json = typeof object === 'string' ? tryParseJsonString(object) : object;

  return path.reduce(
    (value, object) =>
      value[object]?.isLosslessNumber ? Number(value[object].value) : value[object],
    json,
  );
}

/**
 *  过滤 path[] 中的的数组 index 类型元素
 * @param path
 * @param jsonString
 */
export function jsonIndexPathFilter(path: string[], jsonString: string) {
  try {
    const json = JSON.parse(jsonString);
    const { pathList } = path.reduce<{ json: any; pathList: string[] }>(
      (jsonPathData, path) => {
        if (Array.isArray(jsonPathData.json) && Number.isInteger(Number(path))) {
          jsonPathData.json = jsonPathData.json[Number(path)];
        } else {
          jsonPathData.json = jsonPathData.json[path];
          jsonPathData.pathList.push(path);
        }
        return jsonPathData;
      },
      { json, pathList: [] },
    );
    return pathList;
  } catch (error) {
    console.error(error);
    return false;
  }
}
