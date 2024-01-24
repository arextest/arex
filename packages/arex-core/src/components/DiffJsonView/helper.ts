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

/**
 * 根据 path 获取 json 的 value
 * @param object
 * @param path
 */
export function getJsonValueByPath(object?: any, path?: string[]) {
  if (!object || !path || !path?.length) return undefined;

  const json = typeof object === 'string' ? tryParseJsonString(object) : object;

  return path?.reduce(
    (value, object) =>
      value[object]?.isLosslessNumber ? Number(value[object].value) : value[object],
    json,
  );
}

/**
 * 根据 path 设置 json 的 value
 * @param object
 * @param path
 * @param value
 */
export function setJsonValueByPath(object: any, path: string[], value: any) {
  if (!path.length) return value;
  const json = typeof object === 'string' ? tryParseJsonString(object) : object;

  const pathList = path.slice(0, path.length - 1);
  const lastPath = path[path.length - 1];

  pathList.reduce((value, object) => value[object], json)[lastPath] = value;
  console.log([json]);
  return json;
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
