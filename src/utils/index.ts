import { message } from 'antd';
import { v4 as uuid } from 'uuid';
export { uuid };

import React from 'react';

import { PageTypeEnum } from '../constant';
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

/**
 * 生成全局唯一的 globalPanelKey
 * 由于 globalPanelKey 将用于 url 中，需要编码以消除非法字符串（如"."）
 * @param key
 * @param pageType
 */
export const generateGlobalPanelKey = (key: React.Key, pageType: PageTypeEnum) =>
  `${pageType}__${btoa(key.toString())}`;

/**
 * 解析 globalPanelKey 获取真实的页面对象 key
 * @param globalPanelKey
 */
export const parseGlobalPanelKey = (globalPanelKey: string) => {
  const fragments = globalPanelKey.split('__');
  return fragments.length === 2 ? atob(fragments[1]) : undefined;
};
