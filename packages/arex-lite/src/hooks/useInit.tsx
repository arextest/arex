import { ArexMenuManager, ArexPaneManager } from 'arex-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import * as Menus from '../menus';
import * as Panes from '../panes';
import { useCustomNavigate } from '../router/useCustomRouter';

const useInit = () => {
  ArexPaneManager.registerPanes({ ...Panes });
  ArexMenuManager.registerMenus({ ...Menus });

  // const params = useParams();
  // const customNavigate = useCustomNavigate();
  //
  // useEffect(() => {
  //   customNavigate(`/${params.workspaceId}/${params.menuType}/${params.paneType}/${params.id}`);
  // }, []);
};

export default useInit;
