import { parse, stringify } from 'lossless-json';

export function tryParseJsonString<T>(jsonString?: any, errorTip?: string) {
  try {
    return parse(jsonString || '{}') as T;
  } catch (e) {
    console.error(e);
    errorTip && window.message.warning(errorTip);
    return jsonString;
  }
}

export const tryStringifyJson = (
  json: object | null | undefined,
  errorTip?: string,
  prettier?: boolean,
) => {
  try {
    return stringify(json, undefined, prettier ? 2 : undefined);
  } catch (e) {
    errorTip && window.message.warning(errorTip);
    return String(json);
  }
};

export const tryPrettierJsonString = (jsonString: string, errorTip?: string) => {
  try {
    return stringify(parse(jsonString), undefined, 2);
  } catch (e) {
    errorTip && window.message.warning(errorTip);
    return jsonString;
  }
};
