import { match } from 'path-to-regexp';

import { PagesType } from '../../components/panes';
import { MenusType } from '../../enums/menus';

/**
 * 获取当前 URL 所有 GET 查询参数
 * 入参：要解析的 URL，不传则默认为当前 URL
 * 返回：一个<key, value>参数对象
 */
export function getUrlQueryParams(url = location.search) {
  const params: any = {};
  const keys: any = url.match(/([^?&]+)(?==)/g);
  const values: any = url.match(/(?<==)([^&]*)/g);
  for (const index in keys) {
    params[keys[index]] = values[index];
  }
  return params;
}
// 根据url生成paneId
export const genPaneIdByUrl = (url: string) => btoa(encodeURI(url));
export const parsePaneId = (
  paneId: string,
): {
  workspaceId: string;
  pagesType: string;
  rawId: string;
} => {
  try {
    const matchUrl: any = match('/:workspaceId/:pagesType/:rawId', {
      decode: decodeURIComponent,
    });
    const params = matchUrl(atob(decodeURI(paneId)).split('?')[0]).params;
    return {
      workspaceId: params.workspaceId,
      pagesType: params.pagesType,
      rawId: params.rawId,
    };
  } catch (e) {
    return {
      workspaceId: '',
      pagesType: '',
      rawId: '',
    };
  }
};
export const getMenuTypeByPageType = (pageType: any): MenusType => {
  if (
    [PagesType.Folder, PagesType.Request, PagesType.Case, PagesType.Workspace].includes(pageType)
  ) {
    return MenusType.Collection;
  } else if (
    [PagesType.Replay, PagesType.ReplayAnalysis, PagesType.ReplayCase].includes(pageType)
  ) {
    return MenusType.Replay;
  } else if ([PagesType.AppSetting].includes(pageType)) {
    return MenusType.AppSetting;
  } else if ([PagesType.Environment].includes(pageType)) {
    return MenusType.Environment;
  }

  return MenusType.Collection;
};
export const matchUrlParams = (url: string) => {
  const url0 = url.split('?')[0];
  const url1 = url.split('?')[1];

  const matchUrl: any = match('/:workspaceId/:pagesType/:rawId', {
    decode: decodeURIComponent,
  });
  const matchUrlParams = matchUrl(url0).params;
  return {
    params: matchUrlParams,
    searchParams: getUrlQueryParams(url1),
  };
};

export const objToUrl = (obj: any) => {
  const tempArray = [];
  for (const item in obj) {
    if (item) {
      tempArray.push(`${item}=${obj[item]}`);
    }
  }
  return `?${tempArray.join('&')}`;
  //  https://www.xxx.com/xxx?abc=1&type=2
};
