import { parse, stringify } from 'lossless-json';

export function tryParseJsonString<T>(jsonString?: any, errorTip?: string) {
  try {
    return parse(jsonString || '{}') as T;
  } catch (e) {
    console.error(e);
    errorTip && window.message.warning(errorTip);
  }
}

export const tryStringifyJson = (
  jsonString?: object | null,
  errorTip?: string,
  prettier?: boolean,
) => {
  try {
    return stringify(jsonString, undefined, prettier ? 2 : undefined);
  } catch (e) {
    errorTip && window.message.warning(errorTip);
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
