import { useNavigate } from 'react-router-dom';

import { genPaneIdByUrl, getMenuTypeByPageType, JSONparse, matchUrlParams } from '../helpers/utils';
import { useStore } from '../store';

export function useCustomNavigate() {
  const { setPages, pages, collectionTreeData } = useStore();
  const nav = useNavigate();
  function genTitle(p: any): any {
    return p.rawId;
  }
  return function (url: string) {
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
