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
  const { panes, setPanes } = useMenusPanes();
  const nav = useNavigate();

  // register menus and panes
  ArexPaneManager.registerPanes(Panes);
  ArexMenuManager.registerMenus(Menus);

  useEffect(() => {
    // TODO test, remove after workspace function realize
    if (location.pathname === '/') {
      nav('/this-is-workspace-id');
    }

    // Check if the url points to the new Pane
    const match = decodeUrl();
    const { paneType, id } = match.params as StandardPathParams;
    if (paneType && id) {
      const exist = panes.some((pane) => pane.type === paneType && pane.id === id);
      if (!exist)
        setPanes({
          id,
          type: paneType,
          data: match.query,
        });
    }

    // subscribe StandardPathParams and update url
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
