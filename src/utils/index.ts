import { message } from "antd";

import * as ChartUtils from "./chart";
export { ChartUtils };

export const getLocalStorage = (key: string) => {
  const raw = window.localStorage.getItem(key);
  return raw ? JSON.parse(raw) : undefined;
};

export const setLocalStorage = (key: string, value: any) =>
  window.localStorage.setItem(key, JSON.stringify(value));

export const tryParseJsonString = (
  jsonString: string,
  errorTip: string = "invalidJSON"
) => {
  try {
    return JSON.parse(jsonString || "{}");
  } catch (e) {
    message.warn(errorTip);
  }
};

export const tryPrettierJsonString = (
  jsonString: string,
  errorTip: string = "invalidJSON"
) => {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch (e) {
    message.warn(errorTip);
  }
};

export const getPercent = (
  num: number,
  den: number,
  showPercentSign: boolean = true
) => {
  const value = num && den ? parseFloat(((num / den) * 100).toFixed(0)) : 0;
  return showPercentSign ? value + "%" : value;
};
