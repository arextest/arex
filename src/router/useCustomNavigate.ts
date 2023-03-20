import { useNavigate } from 'react-router-dom';

import {
  genPaneIdByUrl,
  getMenuTypeByPageType,
  matchUrlParams,
  objToUrl,
} from '../helpers/functional/url';
import { JSONparse } from '../helpers/utils';
import { useStore } from '../store';

// 代替useNavigate钩子
export function useCustomNavigate() {
  const { setPages, pages, collectionTreeData } = useStore();
  const nav = useNavigate();
  function genTitle({ rawId, pagesType }: any): string {
    return `${pagesType} - ${rawId}`;
  }
  return function (arg: any) {
    let url = '';
    if (typeof arg === 'object') {
      url = arg.path + objToUrl(arg.query);
    } else {
      url = arg;
    }
    const matchUrlParams1 = matchUrlParams(url).params;
    const matchUrlParams2 = matchUrlParams(url).searchParams;
    const paneKey = genPaneIdByUrl(url);

    const find = pages.find((pane) => pane.key === paneKey);
    if (!find) {
      setPages(
        {
          title: genTitle({
            rawId: matchUrlParams1.rawId,
            pagesType: matchUrlParams1.pagesType,
            collectionTreeData: collectionTreeData,
          }),
          menuType: getMenuTypeByPageType(matchUrlParams1.pagesType),
          pageType: matchUrlParams1.pagesType,
          isNew: false,
          data: JSONparse(decodeURIComponent(matchUrlParams2.data)),
          paneId: genPaneIdByUrl(url),
          rawId: matchUrlParams1.rawId,
        },
        'push',
      );
    }
    nav(url);
  };
}
