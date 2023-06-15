import { App } from 'antd';
import { decodeUrl, encodeUrl, I18_KEY, i18n, StandardPathParams } from 'arex-core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_LANGUAGE } from '@/constant';
import { useCollections } from '@/store';
import { useEnvironments, useWorkspaces } from '@/store';
import useMenusPanes from '@/store/useMenusPanes';
import { globalStoreInit } from '@/utils';

const useInit = () => {
  const { message } = App.useApp();
  const { panes, setPanes, setActiveMenu } = useMenusPanes();
  const { getCollections } = useCollections();
  const { workspaces, activeWorkspaceId, setActiveWorkspaceId } = useWorkspaces();
  const nav = useNavigate();

  useEffect(() => {
    globalStoreInit();

    // restore url
    if (location.pathname === '/' && workspaces.length) {
      let workspaceId = workspaces[0].id;
      try {
        const workspacesStorageStr = localStorage.getItem('workspaces-storage');
        workspacesStorageStr &&
          (workspaceId = JSON.parse(workspacesStorageStr).state.activeWorkspaceId);
      } catch (error) {
        console.error(error, 'invalid workspaces storage');
      }
      setActiveWorkspaceId(workspaceId);
      nav(`/${workspaceId}`);
    }

    // check if the url points to the new Pane
    const match = decodeUrl();
    const { paneType, menuType, id, workspaceId } = (match.params as StandardPathParams) || {};

    // if workspaceId is not empty and not equal to activeWorkspaceId, switch workspace
    // this scenario occurs especially when opening a shared link

    const authorized = workspaces.map((ws) => ws.id).includes(workspaceId);
    console.log({ authorized });
    if (workspaceId && workspaceId !== activeWorkspaceId) {
      if (authorized) {
        setActiveWorkspaceId(workspaceId);
        getCollections(workspaceId);
      } else {
        message.error('No target workspace permissions');
      }
    }

    if (authorized && paneType && id) {
      const exist = panes.some((pane) => pane.type === paneType && pane.id === id);
      if (!exist) {
        setActiveMenu(menuType);
        setPanes({
          id,
          type: paneType,
          data: match.query,
        });
      }
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
        useMenusPanes.getState().reset();
        useEnvironments.getState().reset();
        useCollections.getState().getCollections();
        if (activeWorkspaceId) {
          // activeWorkspaceId could be empty string
          const url = encodeUrl(
            // remove menuType,paneType,id and query
            {
              workspaceId: activeWorkspaceId,
            },
          );
          nav(url);
        }
      },
    );

    return () => {
      unSubscribeMenusPane();
      unSubscribeWorkspaces();
    };
  }, []);
};

export default useInit;
