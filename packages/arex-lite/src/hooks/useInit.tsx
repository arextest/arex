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
import { useWorkspaces } from '../store';
import useMenusPanes from '../store/useMenusPanes';

const useInit = () => {
  const { panes, setPanes } = useMenusPanes();
  const { workspaces, setActiveWorkspaceId } = useWorkspaces();
  const nav = useNavigate();

  // register menus and panes
  ArexPaneManager.registerPanes(Panes);
  ArexMenuManager.registerMenus(Menus);

  useEffect(() => {
    if (location.pathname === '/' && workspaces.length) {
      const workspaceId = workspaces[0].id;
      setActiveWorkspaceId(workspaceId);
      nav(`/${workspaceId}`);
    }

    // check if the url points to the new Pane
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

    // subscribe active menu/pane change and update url
    const unSubscribeMenusPane = useMenusPanes.subscribe(
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
        };

        const url = encodeUrl(mergedParams, data);
        nav(url);
      },
    );

    // subscribe active workspace change and update url
    const unSubscribeWorkspaces = useWorkspaces.subscribe(
      (state) => state.activeWorkspaceId,
      (activeWorkspaceId) => {
        const url = encodeUrl(
          // remove menuType,paneType,id and query
          {
            workspaceId: activeWorkspaceId,
          },
        );
        useMenusPanes.getState().reset();
        nav(url);
      },
    );

    return () => {
      unSubscribeMenusPane();
      unSubscribeWorkspaces();
    };
  }, []);
};

export default useInit;
