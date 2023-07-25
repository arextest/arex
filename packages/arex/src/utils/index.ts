import { ArexVersionKey, ArexVersionValue } from '@/constant';
export { default as globalStoreInit } from './globalStoreInit';
export { default as globalStoreReset } from './globalStoreReset';
export { default as request } from './request';
export { default as treeToMap } from './treeToMap';

/**
 * 取反函数
 * @param value
 * @param negate 是否取反
 */
export function negate(value: any, negate = true): boolean {
  return negate ? !value : !!value;
}

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
    const preValue: any = sources.length > i ? sources[i] : 0;
    const preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
    const lastValue: any = dests.length > i ? dests[i] : 0;
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

// 检查 Arex 版本号
export function checkArexVersion() {
  return localStorage.getItem(ArexVersionKey) === ArexVersionValue;
}

// 检查 Chrome 版本号
export function getChromeVersion() {
  let v: any = '';
  try {
    v = navigator.userAgent
      .toLowerCase()
      .match(/chrome\/[\d.]+/gi)?.[0]
      .split('/')[1];
  } catch (e) {
    console.log(e);
  }
  return versionStringCompare(v, '89.00.00');
}
