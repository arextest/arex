import {
  ArexMenuManager,
  ArexPaneManager,
  decodeUrl,
  encodeUrl,
  StandardPathParams,
} from 'arex-core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Menus from '../menus';
import * as Panes from '../panes';
import useMenusPanes, { decodePaneKey } from '../store/useMenusPanes';

const useInit = () => {
  // register menus and panes
  ArexPaneManager.registerPanes(Panes);
  ArexMenuManager.registerMenus(Menus);

  // subscribe StandardPathParams and update url
  const nav = useNavigate();

  useEffect(() => {
    const unsSubscribe = useMenusPanes.subscribe(
      (state) => ({ activePane: state.activePane, activeMenu: state.activeMenu }),
      (currPane) => {
        const match = decodeUrl();
        const { id, type: paneType } = decodePaneKey(currPane.activePane);

        const mergedParams = {
          ...match.params,
          ...{
            menuType: currPane.activeMenu,
            paneType,
            id,
          },
        } as StandardPathParams;
        const mergedData = {
          ...match.query,
          // TODO get pane data
          // ...pane.data
        };

        const url = encodeUrl(mergedParams, mergedData);
        nav(url);
      },
    );
    return () => unsSubscribe();
  }, []);
};

export default useInit;
