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
import useMenusPanes from '../store/useMenusPanes';

const useInit = () => {
  // register menus and panes
  ArexPaneManager.registerPanes(Panes);
  ArexMenuManager.registerMenus(Menus);

  // subscribe StandardPathParams and update url
  const nav = useNavigate();

  useEffect(() => {
    // TODO test, remove after workspace function realize
    if (location.pathname === '/') {
      nav('/this-is-workspace-id');
    }

    const unsSubscribe = useMenusPanes.subscribe(
      (state) => ({ activePane: state.activePane, activeMenu: state.activeMenu }),
      (currPane) => {
        const match = decodeUrl();
        const { id, type: paneType, data } = currPane.activePane || {};

        const mergedParams = {
          ...match.params,
          ...{
            menuType: currPane.activeMenu,
            paneType,
            id,
          },
        } as StandardPathParams;

        const url = encodeUrl(mergedParams, data);
        nav(url);
      },
    );
    return () => unsSubscribe();
  }, []);
};

export default useInit;
