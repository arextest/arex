export function tryParseJsonString<T>(jsonString?: any) {
  try {
    return JSON.parse(jsonString || '{}') as T;
  } catch (e) {
    console.error(e);
    return jsonString;
  }
}

export const tryPrettierJsonString = (jsonString: string) => {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch (e) {
    console.error(e);
    return jsonString;
  }
};
