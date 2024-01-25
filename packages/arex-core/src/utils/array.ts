/**
 * 对象数组去重
 * @param arr 去重对象数组
 * @param key 去重参考 key
 */
export function objectArrayFilter<T extends { [key: string]: any }>(arr: T[], key: string) {
  const res = new Map<keyof T, number>();
  return arr.filter((item) => !res.has(item[key]) && res.set(item[key], 1));
}

export function isObjectOrArray(value: unknown): value is object | Array<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value.constructor === Object || value.constructor === Array)
  );
}
