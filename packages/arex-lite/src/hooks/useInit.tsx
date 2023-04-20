import { ArexMenuManager, ArexPaneManager } from 'arex-core';

import * as Menus from '../menus';
import * as Panes from '../panes';

const useInit = () => {
  ArexPaneManager.registerPanes({ ...Panes });
  ArexMenuManager.registerMenus({ ...Menus });
};

export default useInit;
