import { decodeUrl, encodeUrl, I18_KEY, i18n, StandardPathParams } from '@arextest/arex-core';
import { App } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_LANGUAGE, PanesType } from '@/constant';
import { useCollections, useMenusPanes, useWorkspaces } from '@/store';
import { globalStoreInit } from '@/utils';

const useInit = () => {
  const { message } = App.useApp();
  const { setPanes, setActiveMenu } = useMenusPanes();
  const { getCollections } = useCollections();
  const { workspaces, activeWorkspaceId, setActiveWorkspaceId } = useWorkspaces();
  const nav = useNavigate();

  useEffect(() => {
    globalStoreInit();

    // check if the url points to the new Pane
    const match = decodeUrl();
    const { paneType, menuType, id } = (match.params as StandardPathParams) || {};

    // if workspaceId is not empty and not equal to activeWorkspaceId, switch workspace
    // this scenario occurs especially when opening a shared link
    const needAuthorization = paneType === PanesType.REQUEST;
    if (needAuthorization) {
      const [workspaceId] = id.split('-');
      const authorized = workspaces.map((ws) => ws.id).includes(workspaceId);

      if (workspaceId !== activeWorkspaceId) {
        if (authorized) {
          setActiveWorkspaceId(workspaceId);
          getCollections(workspaceId);
        } else {
          message.error('No target workspace permissions');
        }
      }

      if (authorized && paneType && id) {
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
