import { ArexMenuManager, ArexPaneManager } from 'arex-core';
import { useEffect } from 'react';

import * as Menus from '../menus';
import * as Panes from '../panes';
import useMenusPanes, { decodePaneKey } from '../store/useMenusPanes';
import useNavPane from './useNavPane';

const useInit = () => {
  // register menus and panes
  ArexPaneManager.registerPanes(Panes);
  ArexMenuManager.registerMenus(Menus);

  // subscribe StandardPathParams and update url
  const paneNav = useNavPane({ updateMenusPanesStore: false });
  useEffect(() => {
    const unsSubscribe = useMenusPanes.subscribe(
      (state) => ({ activePane: state.activePane, activeMenu: state.activeMenu }),
      (currPane) => {
        const { id, type: paneType } = decodePaneKey(currPane.activePane);
        paneNav({ paneType, menuType: currPane.activeMenu, id });
      },
    );
    return () => unsSubscribe();
  }, []);
};

export default useInit;
