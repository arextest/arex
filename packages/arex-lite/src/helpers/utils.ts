// import { PageType } from '../pages';
import { match } from 'path-to-regexp';

import { MenuTypeEnum, PageTypeEnum } from '../constant';

export const parseGlobalPaneId = (paneId?: string) => {
  try {
    paneId = paneId || '';
    const arr = atob(decodeURI(paneId)).split('__');
    return {
      menuType: arr[0],
      pageType: arr[1],
      rawId: arr[2],
    };
  } catch (e) {
    return {
      menuType: 'arr[0]',
      pageType: 'arr[1]',
      rawId: 'arr[2]',
    };
  }
};

export const genPaneIdByUrl = (url: string) => btoa(encodeURI(url));

export const parsePaneId = (paneId: string) => {
  try {
    const fn: any = match('/:workspaceId/workspace/:workspaceName/:paneType/:paneId', {
      decode: decodeURIComponent,
    });
    const params = fn(atob(decodeURI(paneId))).params;
    return {
      workspaceId: params.workspaceId,
      workspaceName: params.workspaceName,
      pageType: params.paneType,
      rawId: params.paneId,
    };
  } catch (e) {
    return {
      workspaceId: '',
      workspaceName: '',
      pageType: '',
      rawId: '',
    };
  }
};
// MenuTypeEnum
// PageTypeEnum
export const getMenuTypeByPageType = (pageType: any): MenuTypeEnum => {
  if ([PageTypeEnum.Request, PageTypeEnum.Case, PageTypeEnum.Folder].includes(pageType)) {
    return MenuTypeEnum.Collection;
  } else if ([PageTypeEnum.Environment].includes(pageType)) {
    return MenuTypeEnum.Environment;
  }

  return MenuTypeEnum.Collection;
};

export const JSONparse = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return undefined;
  }
};
