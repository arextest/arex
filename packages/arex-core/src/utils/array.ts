/**
 * 对象数组去重
 * @param arr 去重对象数组
 * @param key 去重参考 key
 */
export function objectArrayFilter<T extends { [key: string]: any }>(arr: T[], key: string) {
  const res = new Map<keyof T, number>();
  return arr.filter((item) => !res.has(item[key]) && res.set(item[key], 1));
}

/**
 * 移除对象中的所有数组
 * @param obj
 */
export function removeAllArrayInObject(obj: any) {
  // 如果是 LosslessNumber，则返回 Number 类型
  if (obj?.isLosslessNumber) return Number(obj.value);

  if (typeof obj !== 'object' || obj === null) {
    // 如果不是对象或者是null，则直接返回
    return obj;
  }

  // 如果是数组，则返回空对象
  if (Array.isArray(obj)) {
    return {};
  }

  // 如果是对象，则递归调用 removeAllArrayInObject 处理对象的每个属性值
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (obj[key] && !Array.isArray(obj[key])) {
      // 仅保留非数组属性
      result[key] = removeAllArrayInObject(obj[key]);
    }
  }

  return result;
}

/**
 * 判断是否是对象或数组
 * @param value
 */
export function isObjectOrArray(value: unknown): value is object | Array<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value.constructor === Object || value.constructor === Array)
  );
}
