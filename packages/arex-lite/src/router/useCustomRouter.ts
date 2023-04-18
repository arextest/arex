import { match } from 'path-to-regexp';
import { useNavigate } from 'react-router-dom';

// import { genPaneIdByUrl, getMenuTypeByPageType } from '../helpers/utils';

export function useCustomNavigate() {
  const nav = useNavigate();
  return function (url: string) {
    const fn: any = match('/:workspaceId/workspace/:workspaceName/:paneType/:paneId', {
      decode: decodeURIComponent,
    });
    // const params = fn(url).params;
    // const paneKey = genPaneIdByUrl(url);

    // Set active pane
    // dispatch((state) => {
    //   const find = state.globalState.panes.find((pane) => pane.key === paneKey);
    //   if (!find) {
    //     state.globalState.panes.push({
    //       key: paneKey,
    //       title: 'suibian',
    //       menuType: getMenuTypeByPageType(params.paneType), //要计算得处
    //       pageType: params.paneType,
    //       rawId: params.paneId,
    //       edited: false,
    //     });
    //   }
    // });
    //
    // Set active menus
    // dispatch((state) => {
    //   state.globalState.activeMenu = [getMenuTypeByPageType(params.paneType), paneKey];
    // });

    nav(url);
  };
}
