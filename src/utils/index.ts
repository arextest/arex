import { message } from 'antd';
import { v4 as uuid } from 'uuid';
export { uuid };

import * as ChartUtils from './chart';
export { ChartUtils };

export const getLocalStorage = (key: string) => {
  const raw = window.localStorage.getItem(key);
  return !raw || raw === 'undefined' || raw === 'null' ? undefined : JSON.parse(raw);
};

export const setLocalStorage = (key: string, value: any) =>
  window.localStorage.setItem(key, JSON.stringify(value));

export const tryParseJsonString = (jsonString: string, errorTip?: string) => {
  try {
    return JSON.parse(jsonString || '{}');
  } catch (e) {
    errorTip && message.warn(errorTip);
    return jsonString;
  }
};

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
