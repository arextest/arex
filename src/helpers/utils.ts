import { message } from 'antd';
import { v4 as uuid } from 'uuid';
export { uuid };

import React from 'react';

import { MenusType } from '../menus';
import { PagesType, PageType } from '../pages';
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
export function setLocalStorage<T>(key: string, value?: T | ((state: T) => void)) {
  let _value = value;
  if (typeof value === 'function') {
    const raw = getLocalStorage<T>(key);
    raw && (value as (state: T) => void)(raw);
    _value = raw;
  }
  return window.localStorage.setItem(key, JSON.stringify(_value));
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

export function tryParseJsonString<T>(jsonString?: string, errorTip?: string) {
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

export const generateGlobalPaneId = (
  menuType: MenusType,
  pageType: PageType<string>,
  rawId: React.Key,
) => btoa(encodeURI(`${menuType}__${pageType}__${rawId}`));

export const parseGlobalPaneId = (paneId?: string) => {
  paneId = paneId || '';
  const arr = atob(decodeURI(paneId)).split('__');
  return {
    menuType: arr[0],
    pageType: arr[1],
    rawId: arr[2],
  };
};

/**
 * 对象数组去重
 * @param arr 去重对象数组
 * @param key 去重参考 key
 */
export function objectArrayFilter<T extends { [key: string]: any }>(arr: T[], key: string) {
  const res = new Map<keyof T, number>();
  return arr.filter((item) => !res.has(item[key]) && res.set(item[key], 1));
}

//版本号比较
export const versionStringCompare = (preVersion = '', lastVersion = '') => {
  const sources = preVersion.split('.');
  const dests = lastVersion.split('.');
  const maxL = Math.max(sources.length, dests.length);
  let result = 0;
  for (let i = 0; i < maxL; i++) {
    const preValue = sources.length > i ? sources[i] : 0;
    const preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
    const lastValue = dests.length > i ? dests[i] : 0;
    const lastNum = isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue);
    if (preNum < lastNum) {
      result = -1;
      break;
    } else if (preNum > lastNum) {
      result = 1;
      break;
    }
  }
  return result;
};

// 检查版本号
export function getChromeVersion() {
  let v = '';
  try {
    v = navigator.userAgent
      .toLowerCase()
      .match(/chrome\/[\d.]+/gi)[0]
      .split('/')[1];
  } catch (e) {
    console.log(e);
  }
  return versionStringCompare(v, '89.00.00');
}
