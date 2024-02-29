import { decodeUrl, encodeUrl, i18n, StandardPathParams } from '@arextest/arex-core';
import { App } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_LANGUAGE, isClient, MessageType, PanesType } from '@/constant';
import { useCollections, useMenusPanes, useMessageQueue, useWorkspaces } from '@/store';
import { globalStoreInit, versionStringCompare } from '@/utils';

const useInit = () => {
  const { message } = App.useApp();
  const { setPanes, setActiveMenu } = useMenusPanes();
  const { getCollections } = useCollections();
  const { workspaces, activeWorkspaceId, setActiveWorkspaceId } = useWorkspaces();
  const nav = useNavigate();
  const { pushMessage } = useMessageQueue();

  useEffect(() => {
    globalStoreInit();

    // check if the url points to the new Pane
    const match = decodeUrl();
    const { paneType, menuType, id } = (match.params as StandardPathParams) || {};

    const openPane = () => {
      if (paneType && id) {
        setActiveMenu(menuType);
        setPanes({
          id,
          type: paneType,
          data: match.query,
        });
      }
    };

    // if workspaceId is not empty and not equal to activeWorkspaceId, switch workspace
    // this scenario occurs especially when opening a shared link
    const needAuthorization = paneType === PanesType.REQUEST;

    if (needAuthorization) {
      const [workspaceId] = id.split('-');
      const authorized = workspaces.map((ws) => ws.id).includes(workspaceId);
      if (workspaceId === activeWorkspaceId || (workspaceId !== activeWorkspaceId && authorized)) {
        setActiveWorkspaceId(workspaceId);
        getCollections({ workspaceId });
        openPane();
      } else {
        message.error('No target workspace permissions');
      }
    } else {
      openPane();
    }

    // Trigger rerender after resources loaded
    i18n.changeLanguage(DEFAULT_LANGUAGE);

    // check if the client version is the latest
    if (isClient) {
      axios.get('https://api.github.com/repos/arextest/releases/releases/latest').then((res) => {
        const version = res.data.name;
        if (versionStringCompare(__APP_VERSION__, version) === -1) {
          pushMessage({
            type: MessageType.update,
            message: 'new version detected',
          });
        }
      });
    }

    if (!window.__AREX_EXTENSION_INSTALLED__) {
      pushMessage({
        type: MessageType.extension,
        message: 'extension not installed',
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

        nav(encodeUrl(mergedParams, data));
      },
    );

    const handleAClick = (e: Event, link: Element) => {
      const url = link.getAttribute('href');
      e.preventDefault();
      url && window.open(url, '_blank');
    };

    const links = document.querySelectorAll('a[href]');
    links.forEach((link) => {
      link.addEventListener('click', (e) => handleAClick(e, link));
    });

    console.log(`
   ____   __   ____ _   ______   ___   ___  _____  __
  /  _/  / /  / __ \\ | / / __/  / _ | / _ \\/ __/ |/_/
 _/ /   / /__/ /_/ / |/ / _/   / __ |/ , _/ _/_>  <  
/___/  /____/\\____/|___/___/  /_/ |_/_/|_/___/_/|_|  
        `);

    return () => {
      unSubscribeMenusPane();
      links.forEach((link) => {
        link.removeEventListener('click', (e) => handleAClick(e, link));
      });
    };
  }, []);
};

export default useInit;
