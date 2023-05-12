import { decodeUrl, encodeUrl, I18_KEY, i18n, StandardPathParams } from 'arex-core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_LANGUAGE } from '@/constant';
import { useCollections } from '@/store';
import { useEnvironments, useWorkspaces } from '@/store';
import useMenusPanes from '@/store/useMenusPanes';
import { globalStoreInit } from '@/utils';

const useInit = () => {
  const { panes, setPanes } = useMenusPanes();
  const { workspaces, setActiveWorkspaceId } = useWorkspaces();
  const nav = useNavigate();

  useEffect(() => {
    globalStoreInit();

    if (location.pathname === '/' && workspaces.length) {
      const workspaceId = workspaces[0].id;
      setActiveWorkspaceId(workspaceId);
      nav(`/${workspaceId}`);
    }

    // check if the url points to the new Pane
    const match = decodeUrl();
    const { paneType, id } = (match.params as StandardPathParams) || {};
    if (paneType && id) {
      const exist = panes.some((pane) => pane.type === paneType && pane.id === id);
      if (!exist)
        setPanes({
          id,
          type: paneType,
          data: match.query,
        });
    }

    // Trigger rerender after resources loaded
    i18n.changeLanguage(localStorage.getItem(I18_KEY) || DEFAULT_LANGUAGE);

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
        useEnvironments.getState().reset();
        useCollections.getState().getCollections();
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
