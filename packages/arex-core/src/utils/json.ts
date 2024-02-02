import * as lossless from 'lossless-json';

export type Parser = { parse: CallableFunction; stringify: CallableFunction };

export function tryParseJsonString<T>(
  jsonString?: any,
  options?: { errorTip?: string; parser?: Parser },
) {
  const { errorTip, parser = lossless } = options || {};
  try {
    return parser.parse(jsonString || '{}') as T;
  } catch (e) {
    console.error(e);
    errorTip && window.message.warning(errorTip);
    return jsonString as T;
  }
}

export const tryStringifyJson = (
  json: object | string | null | undefined,
  options?: { errorTip?: string; prettier?: boolean; parser?: Parser },
) => {
  const { errorTip, prettier, parser = lossless } = options || {};
  try {
    return parser.stringify(json, undefined, prettier ? 2 : undefined);
  } catch (e) {
    errorTip && window.message.warning(errorTip);
    return String(json);
  }
};

export const tryPrettierJsonString = (
  jsonString: string,
  options?: {
    errorTip?: string;
    parser?: Parser;
  },
) => {
  const { errorTip, parser = lossless } = options || {};

  try {
    return parser.stringify(parser.parse(jsonString), undefined, 2);
  } catch (e) {
    errorTip && window.message.warning(errorTip);
    return jsonString;
  }
};

/**
 * 根据 path 获取 json 的 value
 * @param object
 * @param path
 * @param parser
 */
export function getJsonValueByPath(object?: any, path?: string[], parser?: Parser) {
  if (!object || !path || !path?.length) return undefined;

  const json = tryParseJsonString<Record<string, any>>(object, { parser });

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
export function setJsonValueByPath(object: any, path: string[], value: any, parser?: Parser) {
  if (!path.length) return value;

  const json = tryParseJsonString<Record<string, any>>(object, { parser });

  const pathList = path.slice(0, path.length - 1);
  const lastPath = path[path.length - 1];

  pathList.reduce((value, object) => value[object], json)[lastPath] = value;
  return json;
}

/**
 *  过滤 path[] 中的的数组 index 类型元素
 * @param path
 * @param jsonString
 */
export function jsonIndexPathFilter(path?: string[], jsonString?: string, parser?: Parser) {
  if (!path?.length || !jsonString) return [];

  try {
    const json = tryParseJsonString(jsonString, { parser });
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
    return [];
  }
}
