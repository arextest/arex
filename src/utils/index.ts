import { message } from 'antd';
import { v4 as uuid } from 'uuid';
export { uuid };

import * as ChartUtils from './chart';
export { ChartUtils };

/**
 * 从 localStorage 中获取数据
 * 请与 setLocalStorage 配套使用
 * 不应使用该方法获取 window.localStorage.setItem 方法设置的值（反序列化冗余）
 * @param key
 */
export function getLocalStorage<T>(key: string) {
  const raw = window.localStorage.getItem(key);
  return !raw || raw === 'undefined' || raw === 'null' ? undefined : tryParseJsonString<T>(raw);
}

/**
 * 向 localStorage 中存储数据
 * 请与 getLocalStorage 配套使用
 * 使用改方法设置的值不应使用 window.localStorage.getItem 方法获取数据（缺失反序列换过程）
 * @param key
 * @param value
 */
export function setLocalStorage<T>(key: string, value: T) {
  return window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 清空 localStorage 中的数据
 * @param key
 */
export function clearLocalStorage(key?: string) {
  if (key) {
    window.localStorage.removeItem(key);
  } else {
    window.localStorage.clear();
  }
}

export function tryParseJsonString<T>(jsonString: string, errorTip?: string) {
  try {
    return JSON.parse(jsonString || '{}') as T;
  } catch (e) {
    console.error(e);
    errorTip && message.warn(errorTip);
  }
}

export const tryPrettierJsonString = (jsonString: string, errorTip?: string) => {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch (e) {
    errorTip && message.warn(errorTip);
    return jsonString;
  }
};

export const getPercent = (num: number, den: number, showPercentSign = true) => {
  const value = num && den ? parseFloat(((num / den) * 100).toFixed(0)) : 0;
  return showPercentSign ? value + '%' : value;
};
