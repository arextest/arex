import { compile, match } from 'path-to-regexp';
import qs from 'qs';

import { StandardPathParams, StandardPathReg } from '../constant';

/**
 * 获取当前 URL 所有 GET 查询参数
 * 入参：要解析的 URL，不传则默认为当前 URL
 * 返回：一个<key, value>参数对象
 */
export function getUrlQueryParams(url = location.search) {
  const params: Record<string, string> = {};
  const keys = url.match(/([^?&]+)(?==)/g);
  const values = url.match(/(?<==)([^&]*)/g);

  if (!keys || !values) return params;

  for (const index in keys) {
    params[keys[index]] = values[index];
  }
  return params;
}

export const decodeUrl = () => {
  const { pathname, search } = location;
  const matchUrl = match(StandardPathReg, {
    decode: decodeURIComponent,
  })(pathname);
  const matchUrlParams = matchUrl ? matchUrl.params : undefined;

  return {
    params: matchUrlParams,
    query: getUrlQueryParams(search),
  };
};

export function encodeUrl<T>(pathParams: Partial<StandardPathParams>, data?: T | undefined) {
  const compileUrl = compile(StandardPathReg, { encode: encodeURIComponent });
  let url = compileUrl(pathParams);
  if (pathParams.paneType && data && Object.keys(data).length) url += `?${qs.stringify(data)}`;

  return url;
}

export const objToUrl = (obj: Record<string, string | number>) => {
  if (!obj) return '';

  const tempArray = [];
  for (const item in obj) {
    tempArray.push(`${item}=${obj[item]}`);
  }
  //  https://www.xxx.com/xxx?abc=1&type=2
  return `?${tempArray.join('&')}`;
};

export function capitalizeFirstLetter(string: string) {
  return string.replace(/^\w/, (c) => c.toUpperCase());
}
